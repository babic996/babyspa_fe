import { TableArrangementInterface } from "./ArrangementInterface";
import { StatusInterface } from "./StatusInterface";

export interface OverviewReservationInterface {
  reservationId: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  note?: string | null;
  arrangement: TableArrangementInterface;
  status: StatusInterface;
}

export interface CreateOrUpdateReservationInterface {
  reservationId?: number | null;
  startDate: string;
  durationReservation: number;
  note?: string | null;
  arrangementId: number;
  statusId?: number | null;
}
