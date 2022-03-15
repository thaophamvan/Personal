import Http from '../scripts/ultis/Http';
// import simpleNotify from '../scripts/ultis/simpleNotify';

class RecurringServices extends Http {
  getPlan = (cartName) => this.get(`/api/recurringplan/getPlan?cartName=${cartName}`)

  editPlan = (cartName) => this.get(`/api/recurringplan/editPlan?cartName=${cartName}`)

  changePlan = (CartName, Code = '', Quantity = 0, RecurringPlanId = '') => this.put('/api/recurringplan/changePlan', { CartName, Code, Quantity, RecurringPlanId })

  applyPlan = (cartName) => this.get(`/api/recurringplan/applyPlan?cartName=${cartName}`)

  cancelEditPlan = (cartName) => this.get(`/api/recurringplan/cancelEditPlan?cartName=${cartName}`)

  cancelPlan = (cartName) => this.get(`/api/recurringplan/cancelPlan?cartName=${cartName}`)
}

export default new RecurringServices();
