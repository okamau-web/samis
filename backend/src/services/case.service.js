const CaseRepository = require("../repositories/case.repository");
const UserRepository = require("../repositories/user.repository");

const { HISTORY, logHistory } = require("./history.service");

const {
  CASE_PRIORITY,
  CASE_PRIORITY_LIST,
  CASE_STATUS,
  CASE_STATUS_LIST,
} = require("../constants/case.constants");

class CaseService {
  async create(data, user) {
    const {
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
      priority,
    } = data;

    const requiredFields = {
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
    };

    const missingField = Object.entries(requiredFields).find(
      ([, value]) => !value,
    );

    if (missingField) {
      throw new Error(`${missingField[0]} is required.`);
    }

    if (!CASE_PRIORITY_LIST.includes(priority)) {
      throw new Error("Invalid priority selected.");
    }

    const totalCases = await CaseRepository.count();

    const nextNumber = (totalCases + 1).toString().padStart(6, "0");

    const caseNumber = `SAMIS-${new Date().getFullYear()}-${nextNumber}`;

    const newCase = await CaseRepository.create({
      caseNumber,
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
      priority,
      status: CASE_STATUS.REPORTED,
      reportedBy: user.id,
    });

    await logHistory({
      caseId: newCase._id,
      action: HISTORY.CREATED,
      performedBy: user.id,
      newValue: newCase.caseNumber,
      remarks: "Case created successfully.",
    });

    return newCase;
  }

  async findAll(query) {
    return CaseRepository.findAll(query);
  }

  async findById(caseId) {
    return CaseRepository.findByIdOrFail(caseId, "Case not found.");
  }

  async assign(caseId, assignedTo, remarks, user) {
    const officer = await UserRepository.findByIdOrFail(
      assignedTo,
      "Assigned officer not found.",
    );

    const caseRecord = await CaseRepository.findByIdOrFail(
      caseId,
      "Case not found.",
    );

    const updatedCase = await CaseRepository.assign(
      caseId,
      officer._id,
      user.id,
    );

    await logHistory({
      caseId,
      action: HISTORY.ASSIGNED,
      performedBy: user.id,
      oldValue: caseRecord.status,
      newValue: CASE_STATUS.ASSIGNED,
      remarks: remarks || "",
    });

    return updatedCase;
  }

  async updateStatus(caseId, status, remarks, user) {
    const caseRecord = await CaseRepository.findByIdOrFail(
      caseId,
      "Case not found.",
    );

    if (!CASE_STATUS_LIST.includes(status)) {
      throw new Error("Invalid status.");
    }

    if (caseRecord.status === status) {
      throw new Error("Case already has this status.");
    }

    if (caseRecord.status === CASE_STATUS.CLOSED) {
      throw new Error("Closed cases cannot be updated.");
    }

    const updatedCase = await CaseRepository.updateStatus(caseId, status);

    await logHistory({
      caseId,
      action: HISTORY.STATUS_CHANGED,
      performedBy: user.id,
      oldValue: caseRecord.status,
      newValue: status,
      remarks: remarks || "",
    });

    return updatedCase;
  }

  async transfer(caseId, assignedTo, reason, user) {
    const caseRecord = await CaseRepository.findByIdOrFail(
      caseId,
      "Case not found.",
    );

    if (caseRecord.isDeleted) {
      throw new Error("Case not found.");
    }

    if (!caseRecord.assignedTo) {
      throw new Error("Case has not been assigned yet.");
    }

    if (caseRecord.status === CASE_STATUS.CLOSED) {
      throw new Error("Closed cases cannot be transferred.");
    }

    const officer = await UserRepository.findByIdOrFail(
      assignedTo,
      "Officer not found.",
    );

    if (caseRecord.assignedTo.toString() === officer._id.toString()) {
      throw new Error("Case is already assigned to this officer.");
    }

    const previousOfficer = await UserRepository.findById(
      caseRecord.assignedTo,
    );

    const updatedCase = await CaseRepository.transfer(
      caseId,
      officer._id,
      user.id,
      reason,
    );

    await logHistory({
      caseId,
      action: HISTORY.TRANSFERRED,
      performedBy: user.id,
      oldValue:
        previousOfficer?.fullName || previousOfficer?.username || "Unknown",
      newValue: officer.fullName || officer.username,
      remarks: reason || "Case transferred.",
    });

    return updatedCase;
  }
  async update(caseId, data, user) {
    const caseRecord = await CaseRepository.findByIdOrFail(
      caseId,
      "Case not found.",
    );

    if (caseRecord.isDeleted) {
      throw new Error("Case not found.");
    }

    const {
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
      priority,
    } = data;

    const requiredFields = {
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
    };

    const missingField = Object.entries(requiredFields).find(
      ([, value]) => !value,
    );

    if (missingField) {
      throw new Error(`${missingField[0]} is required.`);
    }

    if (!CASE_PRIORITY_LIST.includes(priority)) {
      throw new Error("Invalid priority selected.");
    }

    const changes = [];

    const fields = [
      "title",
      "description",
      "category",
      "county",
      "subCounty",
      "division",
      "location",
      "subLocation",
      "village",
      "priority",
    ];

    fields.forEach((field) => {
      if (caseRecord[field] !== data[field]) {
        changes.push(`${field}: "${caseRecord[field]}" → "${data[field]}"`);
      }
    });

    const updatedCase = await CaseRepository.update(caseId, {
      title,
      description,
      category,
      county,
      subCounty,
      division,
      location,
      subLocation,
      village,
      priority,
    });

    if (changes.length > 0) {
      await logHistory({
        caseId,
        action: HISTORY.UPDATED,
        performedBy: user.id,
        oldValue: "Case Details",
        newValue: "Updated",
        remarks: changes.join(", "),
      });
    }

    return updatedCase;
  }

  async delete(caseId, user) {
    const caseRecord = await CaseRepository.findByIdOrFail(
      caseId,
      "Case not found.",
    );

    if (caseRecord.isDeleted) {
      throw new Error("Case already deleted.");
    }

    const deletedCase = await CaseRepository.softDelete(caseId, user.id);

    await logHistory({
      caseId,
      action: HISTORY.DELETED,
      performedBy: user.id,
      oldValue: "Active",
      newValue: "Deleted",
      remarks: "Case deleted.",
    });

    return deletedCase;
  }

  async restore(caseId, user) {
    const caseRecord = await CaseRepository.findByIdOrFail(
      caseId,
      "Case not found.",
    );

    if (!caseRecord.isDeleted) {
      throw new Error("Case is not deleted.");
    }

    const restoredCase = await CaseRepository.restore(caseId);

    await logHistory({
      caseId,
      action: HISTORY.RESTORED,
      performedBy: user.id,
      oldValue: "Deleted",
      newValue: "Active",
      remarks: "Case restored.",
    });

    return restoredCase;
  }

  async findDeleted() {

    return await CaseRepository.findDeleted();

}
}
module.exports = new CaseService();
