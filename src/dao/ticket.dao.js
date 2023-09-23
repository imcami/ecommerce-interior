import { ticketModel } from "./models/ticket.model.js";

export default class TicketDao {
  async findAll() {
    try {
      return await ticketModel.find();
    } catch (error) {
      throw error;
    }
  }

  async findById(id) {
    try {
      return await ticketModel.findById(id);
    } catch (error) {
      throw error;
    }
  }
  async findByIdAndPopulate(id, populateStr) {
    try {
      return await ticketModel.findById(id).populate(populateStr);
    } catch (error) {
      throw error;
    }
  }

  async createTicket(data) {
    try {
      const ticket = new ticketModel(data);
      return await ticket.save();
    } catch (error) {
      throw error;
    }
  }

  async findTicketByCode(code) {
    try {
      return await ticketModel.findOne({ code: code });
    } catch (error) {
      throw error;
    }
  }
  async findTicketByUser(user) {
    try {
      return await ticketModel.find({ user: user });
    } catch (error) {
      throw error;
    }
  }
  async create(data) {
    try {
      const ticket = new ticketModel(data);
      return await ticket.save();
    } catch (error) {
      throw error;
    }
  }

  async updateTicketByCode(code, updateData) {
    try {
      return await ticketModel.findOneAndUpdate({ code: code }, updateData, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteTicketByCode(code) {
    try {
      return await ticketModel.findOneAndDelete({ code: code });
    } catch (error) {
      throw error;
    }
  }

  async listAllTickets() {
    try {
      return await ticketModel.find();
    } catch (error) {
      throw error;
    }
  }
}
