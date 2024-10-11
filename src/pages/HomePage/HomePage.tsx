import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
} from "antd";
import "./HomePage.scss";
import CalendarComponent from "../../components/CalendarComponent/CalendarComponent";
import { useEffect, useState } from "react";
import {
  CreateOrUpdateReservationInterface,
  OverviewReservationInterface,
} from "../../interfaces/ReservationInterface";
import { useForm, Controller } from "react-hook-form";
import { getStatusList } from "../../services/StatusService";
import {
  addReservation,
  deleteReservation,
  editReservation,
  getReservationsList,
} from "../../services/ReservationServices";
import { StatusInterface } from "../../interfaces/StatusInterface";
import { ShortDetailsInterface } from "../../interfaces/ShortDetails";
import { getArrangementsList } from "../../services/ArrangementService";
import {
  toastErrorNotification,
  toastSuccessNotification,
} from "../../util/toastNotification";
import dayjs from "dayjs";
import FullPageSpiner from "../../components/FullPageSpiner/FullPageSpiner";
const HomePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditReservation, setIsEditReservation] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusInterface[]>([]);
  const [reservations, setReservations] = useState<
    OverviewReservationInterface[]
  >([]);
  const [arrangements, setArrangements] = useState<ShortDetailsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateOrUpdateReservationInterface>();

  useEffect(() => {
    Promise.all([
      getArrangementsList(),
      getStatusList("reservation"),
      getReservationsList(),
    ])
      .then(([arrangementsRes, statusRes, reservationsRes]) => {
        setArrangements(arrangementsRes);
        setStatus(statusRes);
        setReservations(reservationsRes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Došlo je do greške:", error);
      });
  }, []);

  //------------------METHODS----------------

  const handleEdit = (record: CreateOrUpdateReservationInterface) => {
    setIsEditReservation(true);
    reset(record);
    setIsModalOpen(true);
  };

  const handleDelete =
    (reservationId?: number | null) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (reservationId) {
        setLoading(true);
        deleteReservation(reservationId).then(() => {
          getReservationsList()
            .then((result) => {
              setLoading(false);
              setReservations(result);
              toastSuccessNotification("Obrisano!");
            })
            .catch((e) => {
              toastErrorNotification(e.response.data.message);
            });
        });
      }
      setIsModalOpen(false);
    };

  const handleModalCancel = () => {
    reset({
      reservationId: null,
      statusId: 0,
      arrangementId: 0,
      note: "",
    });
    setIsEditReservation(false);
    setIsModalOpen(false);
  };

  const handleCreateModal = () => {
    reset({
      reservationId: null,
      statusId: 0,
      arrangementId: 0,
      note: "",
    });
    setIsEditReservation(false);
    setIsModalOpen(true);
  };

  const onSubmit = (data: CreateOrUpdateReservationInterface) => {
    setLoading(true);
    if (isEditReservation) {
      editReservation(data)
        .then((res) => {
          setReservations((prev) =>
            prev.map((item) =>
              item.reservationId == data.reservationId
                ? { ...item, ...res.data.data }
                : item
            )
          );
          setLoading(false);
          toastSuccessNotification("Ažurirano!");
        })
        .catch((e) => {
          toastErrorNotification(e.response.data.message);
        });
    } else {
      addReservation(data)
        .then(() => {
          getReservationsList()
            .then((result) => {
              setLoading(false);
              setReservations(result);
              toastSuccessNotification("Sačuvano!");
            })
            .catch((e) => {
              toastErrorNotification(e.response.data.message);
            });
        })
        .catch((e) => {
          toastErrorNotification(e.response.data.message);
        });
    }
    setIsModalOpen(false);
  };

  //------------------RENDER------------------

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <>
      <Modal
        title={
          isEditReservation ? "Uredi rezervaciju" : "Dodaj novi rezervaciju"
        }
        maskClosable={false}
        open={isModalOpen}
        footer={null}
        width={800}
        onCancel={handleModalCancel}
      >
        <Form onFinish={handleSubmit(onSubmit)} {...layout}>
          {!isEditReservation && (
            <Form.Item
              label="Odaberi paket usluge"
              validateStatus={errors.arrangementId ? "error" : ""}
              help={errors.arrangementId?.message}
            >
              <Controller
                name="arrangementId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Odaberi aranžman"
                    value={field.value == 0 ? null : field.value}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {arrangements?.map((x) => (
                      <Select.Option key={x.id} value={x.id}>
                        {x.value}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          )}
          {!isEditReservation && (
            <Form.Item
              label="Datum i vrijeme termina"
              validateStatus={errors.startDate ? "error" : ""}
              help={errors.startDate?.message}
            >
              <Controller
                name="startDate"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    showTime
                    value={value ? dayjs(value, "YYYY-MM-DD") : null}
                    onChange={(date) =>
                      onChange(
                        date ? dayjs(date).format("YYYY-MM-DDTHH:mm:ss") : ""
                      )
                    }
                    style={{ width: "100%" }}
                  />
                )}
              />
            </Form.Item>
          )}
          {!isEditReservation && (
            <Form.Item
              label="Trajanje termina u minutama"
              validateStatus={errors.durationReservation ? "error" : ""}
              help={errors.durationReservation?.message}
            >
              <Controller
                name="durationReservation"
                control={control}
                render={({ field }) => (
                  <InputNumber {...field} min={0} style={{ width: "100%" }} />
                )}
              />
            </Form.Item>
          )}

          {isEditReservation && (
            <Form.Item
              label="Odaberi status"
              validateStatus={errors.statusId ? "error" : ""}
              help={errors.statusId?.message}
            >
              <Controller
                name="statusId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Odaberi status"
                    value={field.value == 0 ? null : field.value}
                  >
                    {status?.map((x) => (
                      <Select.Option key={x.statusId} value={x.statusId}>
                        {x.statusName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          )}
          <Form.Item
            label="Bilješka"
            validateStatus={errors.note ? "error" : ""}
            help={errors.note?.message}
          >
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  value={field.value ?? ""}
                  autoSize={{ minRows: 0, maxRows: 6 }}
                />
              )}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "center" }} wrapperCol={{ span: 24 }}>
            <Button.Group>
              <Button type="primary" htmlType="submit">
                Sačuvaj
              </Button>
              {isEditReservation && (
                <Button
                  type="default"
                  danger
                  onClick={handleDelete(getValues("reservationId"))}
                >
                  Obriši
                </Button>
              )}
            </Button.Group>
          </Form.Item>
        </Form>
      </Modal>
      {loading && <FullPageSpiner />}
      <div className="container">
        <Button
          type="primary"
          className="custom-button"
          onClick={handleCreateModal}
        >
          Dodaj rezervaciju
        </Button>
        <div className="calendar-wrapper">
          <CalendarComponent
            reservations={reservations}
            onEventClick={handleEdit}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
