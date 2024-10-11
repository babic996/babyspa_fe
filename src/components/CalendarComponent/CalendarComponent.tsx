import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/dist/locale/bs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  CreateOrUpdateReservationInterface,
  OverviewReservationInterface,
} from "../../interfaces/ReservationInterface";
import dayjs from "dayjs";
import { convertOverviewReservationInterfaceToCreateOrUpdateReservationInterface } from "../../mappers/ReservationMapper";
import { calendarMessages } from "../../util/const";
moment.locale("bs");

const localizer = momentLocalizer(moment);

interface CalendarComponentProps {
  reservations?: OverviewReservationInterface[];
  onEventClick: (record: CreateOrUpdateReservationInterface) => void;
}
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  reservation: OverviewReservationInterface;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  reservations,
  onEventClick,
}) => {
  const events =
    reservations?.map((reservation) => ({
      title:
        reservation.arrangement.babyDetails.value +
        " - " +
        reservation.status.statusName,
      start: dayjs(reservation.startDate).toDate(),
      end: dayjs(reservation.endDate).toDate(),
      reservation: reservation,
    })) || [];

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick(
      convertOverviewReservationInterfaceToCreateOrUpdateReservationInterface(
        event.reservation
      )
    );
  };

  return (
    <div style={{ height: "calc(100vh - 50px)" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        defaultView="month"
        onSelectEvent={handleEventClick}
        messages={calendarMessages}
      />
    </div>
  );
};

export default CalendarComponent;
