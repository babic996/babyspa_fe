import { ShortDetailsInterface } from "./ShortDetails";

export interface CreateOrUpdateArrangementInterface {
  arrangementId?: number | null;
  note?: string | null;
  discountId?: number;
  babyId: number;
  statusId: number;
  servicePackageId: number;
  paymentTypeId?: number;
}

export interface TableArrangementInterface {
  arrangementId: number;
  createdAt: string;
  remainingTerm: number;
  price: number;
  note?: string | null;
  discount?: ShortDetailsInterface | null;
  babyDetails: ShortDetailsInterface;
  status: ShortDetailsInterface;
  servicePackage: ShortDetailsInterface;
  paymentType: ShortDetailsInterface;
}
