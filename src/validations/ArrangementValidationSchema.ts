import * as yup from "yup";

export const ArrangementValidationSchema = () => {
  return yup.object().shape({
    arrangementId: yup.number().nullable().optional(),
    note: yup.string().nullable().optional(),
    discountId: yup.number().nullable().optional(),
    babyId: yup.number().required("Odabir bebe je obavezan."),
    statusId: yup.number().nullable().required("Status je obavezan."),
    servicePackageId: yup.number().required("Paket usluge je obavezan."),
    paymentTypeId: yup.number().nullable().optional(),
  });
};

export const UpdateArrangementValidationSchema = () => {
  return ArrangementValidationSchema();
};

export const CreateArrangementValidationSchema = () => {
  return ArrangementValidationSchema();
};
