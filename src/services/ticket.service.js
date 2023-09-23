import TicketDao from "../dao/ticket.dao.js";
const ticketDao = new TicketDao();
class TicketService {
  async findAll() {
    try {
      return await ticketDao.findAll();
    } catch (error) {
      return error;
    }
  }
  async findById(id) {
    try {
      return await ticketDao.findById(id);
    } catch (error) {
      return error;
    }
  }
  async findByIdAndPopulate(id, populateStr) {
    try {
      return await ticketDao.findByIdAndPopulate(id, populateStr);
    } catch (error) {
      return error;
    }
  }
  async findOneAndUpdate(filter, update, options) {
    try {
      return await ticketDao.findOneAndUpdate(filter, update, options);
    } catch (error) {
      return error;
    }
  }
  async create(data) {
    try {
      return await ticketDao.create(data);
    } catch (error) {
      return error;
    }
  }
  async delete(id) {
    try {
      return await ticketDao.deleteTicketByCode(id);
    } catch (error) {
      return error;
    }
  }
}

const ticketService = new TicketService();
export default ticketService;
