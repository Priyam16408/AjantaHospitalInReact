import * as Yup from "yup";
export const addNewExpenseValidation = Yup.object().shape({
  PaymentType: Yup.string().required("Payment type is required"),
  EmployeeType: Yup.string().required("Employee type is required"),
  NAME: Yup.string().required("Name is required"),
  RoleID: Yup.string().required("Role is required"),
  ExpenceTypeId: Yup.string().required("Expense type is required"),
  ExpenceToId: Yup.string().required("Expense to is required"),
  AmountPaid: Yup.number().required("Amount is required"),
  ApprovedBy: Yup.string().required("Approved by is required"),
  Naration: Yup.string().required("Naration is required"),
});
