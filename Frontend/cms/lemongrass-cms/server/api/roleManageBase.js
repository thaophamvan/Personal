const _ = require("lodash");
const baseApi = require("./baseApi");
const dbUtils = require("../lib/db");
/*eslint-disable */
const common = require("../util/common");
const logger = require("../util/logger");
const UsersLocalizationPermission = require("./userLocalizationPermissionBase");

const dbNameLocalizationPermission = "localization_permission";
const apiUserLocalizationPermission = new UsersLocalizationPermission(dbNameLocalizationPermission);
const dbSetting = "setting_localization";

class roleManageBase extends baseApi {
  constructor(dbName) {
    super(dbName);
    this.allDatabase = ["Drink Type", "Drink Temperature", "Auto Dose", "Localization", "Historical", "Permission"];

    this.rolesPermissionList = [
      {
        roleId: "Admin",
        roleName: "Admin",
        role: "readWrite",
        db: this.allDatabase,
      },
      {
        roleId: "AdminLocalization",
        roleName: "Admin - Localization",
        role: "readWrite",
        db: ["Localization"],
      },
      {
        roleId: "EditorLocalization",
        roleName: "Editor - Localization",
        role: "readWrite",
        db: ["Localization"],
      },
      {
        roleId: "EditorDrinkChills",
        roleName: "Editor - Drink Chills",
        role: "readWrite",
        db: ["Drink Type", "Drink Temperature"],
      },
      {
        roleId: "EditorAutodosing",
        roleName: "Editor - Autodosing",
        role: "readWrite",
        db: ["Auto Dose"],
      },
    ];
    // todo Database
    this.userRoleList = [
      {
        userId: "thao.pham@Personal.se",
        roleId: "Admin",
      },
      {
        userId: "truong.nguyen@Personal.se",
        roleId: ["AdminLocalization"],
      },
    ];
  }

  async getAllRoles(req, res) {
    res.send(this.rolesPermissionList);
  }

  async createUserToRoleManage(userData) {
    const db = dbUtils.get(this.dbName);
    userData = {
      ...userData,
      roles: [],
    };
    const { userId } = userData;
    const result = await this.searchByUserId(userId);
    const { data } = result;
    if (data.length === 0) {
      db.create(userData)
        .then((res) => {
          logger.info("Add user successfully");
        })
        .catch((err) => {
          logger.error(`Error Trace ${err}`);
        });
    }
  }

  async searchByUserId(searchString) {
    const db = dbUtils.get(this.dbName);
    const selector = {
      selector: {
        userId: searchString,
      },
    };
    // get all data from db
    try {
      const result = await db.query(selector);
      return result;
    } catch (err) {
      logger.error(`Error Trace ${err}`);
      return null;
    }
  }

  async updateUserRoles(req, res) {
    const usersAccessMetrix = req.body ? req.body : [];

    let tempUsersAccessMetrix = _.cloneDeep(usersAccessMetrix);
    tempUsersAccessMetrix = tempUsersAccessMetrix.filter((x) => !x._deleted);
    // data user lacalization permission
    const dataULP = [];

    // get all language from setting_language and format data
    const dataAllLanguage = await this.getAllData(dbSetting);
    const languages = dataAllLanguage.data[0].arrayLang.map((x) => x.lang);

    // get all data lacalization_permission
    const allDataULP = await this.getAllData(dbNameLocalizationPermission);

    // delete all data in localization_permission
    const tempAllDataULP = _.cloneDeep(allDataULP);
    tempAllDataULP.data.map((x) => (x._deleted = true));
    await this.putMultipleULP(tempAllDataULP.data, dbNameLocalizationPermission);
    console.log("delete success localization_permission");

    // when update data access metrix then update data user localization permission.
    // sync data with role is adminLocalization and editorLocalization and update
    for (const element of tempUsersAccessMetrix) {
      const userULP = allDataULP.data.filter((x) => x.userId === element.userId);

      element.roles.forEach((x) => {
        // handle case item in user_access_metrix have bold roles admin_localization and editor_localization
        const indexInDataULP = dataULP.findIndex((val) => val.userId === element.userId);
        if (x.roleId === "AdminLocalization" || x.roleId === "Admin") {
          if (userULP.length === 0) {
            if (indexInDataULP === -1) {
              const userData = {
                userId: element.userId,
                languages,
                isAdmin: true,
              };
              dataULP.push(userData);
            } else {
              dataULP[indexInDataULP].isAdmin = true;
              dataULP[indexInDataULP].languages = languages;
            }
          } else {
            userULP[0].isAdmin = true;
            userULP[0].languages = languages;
            if (indexInDataULP === -1) {
              dataULP.push(userULP[0]);
            } else {
              dataULP[indexInDataULP] = userULP[0];
            }
          }
        } else if (x.roleId === "EditorLocalization") {
          // // check case user access roles with bold AdminLocalization and editorLocalization
          // let isExistUser = dataULP.some(val => val.userId === element.userId);
          if (indexInDataULP === -1) {
            // check user in user acess metrix not exist in userULP
            if (userULP.length === 0) {
              const userData = {
                userId: element.userId,
                languages: [],
                isAdmin: false,
              };
              dataULP.push(userData);
            } else {
              userULP[0].isAdmin = false;
              dataULP.push(userULP[0]);
            }
          }
        }
      });
    }
    dataULP.forEach((element) => {
      delete element._id;
      delete element._rev;
    });
    await this.putMultipleULP(dataULP, dbNameLocalizationPermission);
    await super.putMultiple(req, res);
  }

  async getAllData(dbName) {
    const db = dbUtils.get(dbName);
    return db
      .query({})
      .then((data) => data)
      .catch((err) => {
        logger.error(`Error Trace ${err}`);
      });
  }

  async putMultipleULP(arrayData, dbName) {
    const db = dbUtils.get(dbName);
    return db
      .bulk(arrayData)
      .then((data) => data)
      .catch((err) => {
        logger.error(`Error Trace ${err}`);
      });
  }
}

module.exports = roleManageBase;
