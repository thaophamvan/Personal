const Cloudant = require('@cloudant/cloudant')

function DB(dbName, credentials) {
  const DB_NAME = dbName
  const cloudant = Cloudant({
    url: credentials.url,
    plugin: 'retry',
    retryAttempts: 10,
    retryTimeout: 500
  })

  const maximumRecords = 1000000
  const self = this
  let db

  self.type = function () {
    return 'Cloudant'
  }

  self.init = () => new Promise((resolve, reject) => {
    cloudant.db.get(DB_NAME, (err,result) => {
      if (!err) {
        db = cloudant.db.use(DB_NAME)
        resolve()
      } else {
        cloudant.db.create(DB_NAME, (err) => {
          if (err) {
            reject(err)
          } else {
            db = cloudant.db.use(DB_NAME)
            resolve()
          }
        })
      }
    })
  })

  self.count = () => new Promise((resolve, reject) => {
    db.list((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.total_rows)
      }
    })
  })

  self.search = () => new Promise((resolve, reject) => {
    db.list({ include_docs: true }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.rows.map((row) => {
          const doc = row.doc
          doc.id = doc._id
          delete doc._id
          return doc
        }))
      }
    })
  })

  self.query = (params) => new Promise((resolve, reject) => {  
    let limit = params.limit  ? params.limit : maximumRecords;
    let skip = params.skip  ? params.skip : 0;
    let selector = params.selector  ? params.selector : {};
    let sort = params.sort  ? params.sort : [];
    var jsonQuerying = {
      "selector": selector, //Empty objecet because do not query by any field,
      "limit": limit,
      "skip": skip,
      "sort": sort
    };

    db.find(jsonQuerying, async (err,result)=>{
      if (err){
        reject(err);
      } else {
        var promiseResult = new Promise((res,rej)=>{
          db.list({}, (er,result)=>{
            res(result.total_rows);
          });
        });
        promiseResult.then((total)=>{
          const data = result.docs.map((row) => {          
            const doc = row
            doc.id = doc._id
            delete doc._id
            return doc
          });            
          resolve({total, data});
        });
      }
    })
  })

  self.find = (params) => new Promise((resolve, reject) => {  
    let limit = params.limit  ? params.limit : maximumRecords;
    let skip = params.skip  ? params.skip : 0;
    let selector = params.selector  ? params.selector : {};
    let sort = params.sort  ? params.sort : [];
    let fields = params.fields ? params.fields : [];
    var jsonQuerying = {
      "selector": selector, //Empty objecet because do not query by any field,
      // "limit": limit, // not enabled limit for search, temporary way
      // "skip": skip, // not enabled limit for search, temporary way
      "fields": fields,
      "sort": sort
    };

    db.find(jsonQuerying, async (err,result)=>{
      if (err){
        reject(err);
      } else {
        const total = result.docs.length;
        const data = result.docs.filter((row, index) =>(index > (skip - 1) && index < (skip + limit))).map((row) => {          
          const doc = row
          doc.id = doc._id
          delete doc._id
          return doc
        });            
        resolve({total, data});
      }
    })
  })

  self.create = (item) => {
    return new Promise((resolve, reject) => {
      db.insert(item, { include_docs: true }, (err, savedItem) => {
        if (err) {
          reject(err)
        } else {
          const newItem = {
            ...item,
            id: savedItem.id,
            _rev: savedItem.rev,
          }
          resolve(newItem)
        }
      })
    })
  }

  self.read = (id) => {
    return new Promise((resolve, reject) => {
      db.get(id, (err, item) => {
        if (err) {
          reject(err)
        } else {
          item.id = item._id
          delete item._id
          resolve(item)
        }
      })
    })
  }

  // sometimes id is wrong, update function will be insert function. Use carefully.
  self.update = (id, newValue) => {
    return new Promise((resolve, reject) => {
      newValue._id = newValue.id
      delete newValue.id
      db.insert(newValue, (err, updatedItem) => {
        if (err) {
          reject(err)
        } else {
          newValue.id = newValue._id
          newValue._rev = updatedItem.rev
          delete newValue._id
          resolve(newValue)
        }
      })
    })
  }

  self.bulk = (newValue) => {
    return new Promise((resolve, reject) => {
      // map id -> _id
      newValue.map(value => {
        value._id = value.id;
        delete value.id
        return value;
      })
      db.bulk({docs: newValue}, (err, data) => {
        if (err) {
          reject(err)
        } else {
          if(data && data.length > 0) {
            if(!data.every(ele => ele.ok)) {
              reject(data);
            }
          }
          resolve(data)
        }
      })
    })
  }

  self.delete = (id) => {
    return new Promise((resolve, reject) => {
      self.read(id).then((item) => {
        db.destroy(item.id, item._rev, (err) => { // (err, body)
          if (err) {
            reject(err)
          } else {
            resolve(item)
          }
        })
      }).catch((err) => {
        reject(err)
      })
    })
  }

  self.createIndex = (index) => {
    return new Promise((resolve, reject) => {
      db.index(index, function(err, response) {
        if (err) {
          reject(err) ;
        }
        resolve(response.result)
      });
    })
  }
}

module.exports = function (dbName, credentials) {
  return new DB(dbName, credentials)
}
