import { useForm, Controller } from "react-hook-form";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Input,
  Form,
  InputNumber,
  DatePicker,
} from "antd";
import "./BabyPage.scss";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BabyInterface } from "../../interfaces/BabyInterface";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CreateBabyValidationSchema,
  UpdateBabyValidationSchema,
} from "../../validations/BabyValidationSchema";
import {
  getBabies,
  addBaby,
  editBaby,
  deleteBaby,
} from "../../services/BabyService";
import dayjs from "dayjs";
import { DEFAULT_PAGE_SIZE } from "../../util/const";
import InfoModal from "../../components/InfoModal/InfoModal";
import {
  toastErrorNotification,
  toastSuccessNotification,
} from "../../util/toastNotification";
import FilterComponent from "../../components/FilterComponent/FilterComponent";

const BabyPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number>(1);
  const [babies, setBabies] = useState<BabyInterface[]>([]);
  const [totalElements, setTotalElements] = useState<number>();
  const [isEditBaby, setIsEditBaby] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BabyInterface>({
    resolver: yupResolver(
      isEditBaby ? UpdateBabyValidationSchema() : CreateBabyValidationSchema()
    ),
  });

  //------------------LIFECYCLE------------------

  useEffect(() => {
    getBabies(cursor - 1)
      .then((result) => {
        setBabies(result.data.content);
        setTotalElements(result.data.totalElements);
        setLoading(false);
      })
      .catch((e) => {
        toastErrorNotification(e.response.data.message);
      });
  }, [cursor]);

  //------------------METOHDS------------------

  const handleEdit = (record: BabyInterface) => {
    setIsEditBaby(true);
    reset(record);
    setIsModalOpen(true);
  };

  const handleDelete = (babyId?: number | null) => {
    if (babyId) {
      setLoading(true);
      deleteBaby(babyId).then(() => {
        getBabies(cursor - 1)
          .then((result) => {
            setLoading(false);
            setBabies(result.data.content);
            setTotalElements(result.data.totalElements);
            toastSuccessNotification("Obrisano!");
          })
          .catch((e) => {
            toastErrorNotification(e.response.data.message);
          });
      });
    }
  };

  const handleModalCancel = () => {
    reset({
      babyId: null,
      babyName: "",
      babySurname: "",
      birthDate: null,
      numberOfMonths: 0,
      phoneNumber: "",
      motherName: "",
      note: "",
    });
    setIsEditBaby(false);
    setIsModalOpen(false);
  };

  const handleCreateModal = () => {
    reset({
      babyId: null,
      babyName: "",
      babySurname: "",
      birthDate: null,
      numberOfMonths: 0,
      phoneNumber: "",
      motherName: "",
      note: "",
    });
    setIsEditBaby(false);
    setIsModalOpen(true);
  };

  const nextPage = (page: number) => {
    setCursor(page);
  };

  const handleOpenInfoModal = (note: string) => {
    setCurrentNote(note);
    setIsInfoModalVisible(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalVisible(false);
    setCurrentNote("");
  };

  const onSubmit = (data: BabyInterface) => {
    setLoading(true);
    if (isEditBaby) {
      editBaby(data)
        .then((res) => {
          setBabies((prevBabies) =>
            prevBabies.map((baby) =>
              baby.babyId == data.babyId ? { ...baby, ...res.data.data } : baby
            )
          );
          setLoading(false);
          toastSuccessNotification("Ažurirano!");
        })
        .catch((e) => {
          toastErrorNotification(e.response.data.message);
        });
    } else {
      addBaby(data)
        .then(() => {
          getBabies(cursor - 1)
            .then((result) => {
              setLoading(false);
              setBabies(result.data.content);
              setTotalElements(result.data.totalElements);
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
    wrapperCol: { span: 24 },
  };

  const columns: ColumnsType<BabyInterface> = [
    {
      title: "Ime",
      dataIndex: "babyName",
      key: "babyName",
    },
    {
      title: "Prezime",
      dataIndex: "babySurname",
      key: "babySurname",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Datum rođenja",
      dataIndex: "birthDate",
      key: "birthDate",
      render: (value) => {
        return value
          ? dayjs(value).format("DD.MM.YYYY.") + " godine"
          : "Nema podatka";
      },
    },
    {
      title: "Broj mjeseci",
      dataIndex: "numberOfMonths",
      key: "numberOfMonths",
    },
    {
      title: "Telefon",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ime majke",
      dataIndex: "motherName",
      key: "motherName",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Bilješka",
      dataIndex: "note",
      key: "note",
      render: (value) => {
        const previewText =
          value.length > 3 ? value.slice(0, 3) + "..." : value;

        return (
          <span
            onClick={() => handleOpenInfoModal(value)}
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {previewText}
          </span>
        );
      },
    },
    {
      title: "Uredi",
      key: "actions",
      render: (_, record) => (
        <>
          <EditOutlined
            style={{ marginRight: 16 }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Da li ste sigurni da želite obrisati ovu bebu?"
            onConfirm={() => handleDelete(record.babyId)}
            okText="Da"
            cancelText="Ne"
          >
            <DeleteOutlined style={{ color: "red" }} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <InfoModal
        visible={isInfoModalVisible}
        onClose={handleCloseInfoModal}
        fullText={currentNote}
      />
      <Modal
        title={isEditBaby ? "Uredi bebu" : "Dodaj novu bebu"}
        maskClosable={false}
        open={isModalOpen}
        footer={null}
        onCancel={handleModalCancel}
      >
        <Form onFinish={handleSubmit(onSubmit)} {...layout}>
          <Form.Item
            label="Ime"
            validateStatus={errors.babyName ? "error" : ""}
            help={errors.babyName?.message}
          >
            <Controller
              name="babyName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Prezime"
            validateStatus={errors.babySurname ? "error" : ""}
            help={errors.babySurname?.message}
          >
            <Controller
              name="babySurname"
              control={control}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Datum rođenja"
            validateStatus={errors.birthDate ? "error" : ""}
            help={errors.birthDate?.message}
          >
            <Controller
              name="birthDate"
              control={control}
              render={({ field: { onChange, value } }) => (
                <DatePicker
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

          <Form.Item
            label="Broj mjeseci"
            validateStatus={errors.numberOfMonths ? "error" : ""}
            help={errors.numberOfMonths?.message}
          >
            <Controller
              name="numberOfMonths"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0} style={{ width: "100%" }} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Broj telefona"
            validateStatus={errors.phoneNumber ? "error" : ""}
            help={errors.phoneNumber?.message}
          >
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Ime majke"
            validateStatus={errors.motherName ? "error" : ""}
            help={errors.motherName?.message}
          >
            <Controller
              name="motherName"
              control={control}
              render={({ field }) => (
                <Input {...field} value={field.value ?? ""} />
              )}
            />
          </Form.Item>

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
            <Button type="primary" htmlType="submit">
              Sačuvaj
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ maxWidth: "100%", padding: "16px" }}>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 16 }}
        >
          <Button
            type="primary"
            onClick={handleCreateModal}
            style={{ marginBottom: 16 }}
          >
            Dodaj Bebu
          </Button>
        </div>
        <FilterComponent showSearch={true} showRangePicker={true} />
        <Table
          columns={columns}
          loading={loading}
          dataSource={babies}
          rowKey="babyId"
          pagination={{
            current: cursor,
            pageSize: DEFAULT_PAGE_SIZE,
            total: totalElements,
            onChange: nextPage,
          }}
        />
      </div>
    </>
  );
};

export default BabyPage;
