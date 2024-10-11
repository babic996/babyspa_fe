import * as yup from "yup";

export const UpdateServicePackageValidationSchema = () => {
  return yup.object().shape({
    servicePackageId: yup.number().required(),
    servicePackageName: yup
      .string()
      .required("Morate unijeti naziv paketa usluge")
      .trim(),
    termNumber: yup
      .number()
      .min(1, "Broj termina mora biti veći od 0")
      .required("Morate unijeti broj termina"),
    servicePackageDurationDays: yup
      .number()
      .min(1, "Broj dana koliko traje paket usluge mora biti veći od 0")
      .required("Morate unijeti broj dana koliko traje paket usluge"),
    price: yup
      .number()
      .required("Cijena je obavezna")
      .positive("Cijena mora biti pozitivan broj")
      .typeError("Cijena mora biti broj"),
    note: yup.string().nullable().optional(),
  });
};

export const CreateServicePackageValidationSchema = () => {
  return yup.object().shape({
    servicePackageName: yup
      .string()
      .required("Morate unijeti naziv paketa usluge")
      .trim(),
    termNumber: yup
      .number()
      .min(1, "Broj termina mora biti veći od 0")
      .required("Morate unijeti broj termina"),
    servicePackageDurationDays: yup
      .number()
      .min(1, "Broj dana koliko traje paket usluge mora biti veći od 0")
      .required("Morate unijeti broj dana koliko traje paket usluge"),
    price: yup
      .number()
      .required("Cijena je obavezna")
      .positive("Cijena mora biti pozitivan broj")
      .typeError("Cijena mora biti broj"),
    note: yup.string().nullable().optional(),
  });
};
