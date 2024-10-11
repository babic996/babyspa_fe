import { useEffect, useState } from "react";
import { ServicePackageInterface } from "../../interfaces/ServicePackageInterface";
import {
  addServicePackage,
  deleteServicePackage,
  editServicePackage,
  getServicePackages,
} from "../../services/ServicePackageService";
import {
  toastErrorNotification,
  toastSuccessNotification,
} from "../../util/toastNotification";
import {
  Button,
  Table,
  Popconfirm,
  Modal,
  Form,
  Input,
  InputNumber,
} from "antd";
import FilterComponent from "../../components/FilterComponent/FilterComponent";
import { DEFAULT_PAGE_SIZE } from "../../util/const";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  CreateServicePackageValidationSchema,
  UpdateServicePackageValidationSchema,
} from "../../validations/ServicePackageValidationSchema";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InfoModal from "../../components/InfoModal/InfoModal";

const ServicePackagePage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number>(1);
  const [servicePackages, setServicePackages] = useState<
    ServicePackageInterface[]
  >([]);
  const [totalElements, setTotalElements] = useState<number>();
  const [isEditServicePackage, setIsEditServicePackage] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentNote, setCurrentNote] = useState<string>("");
  const [isInfoModalVisible, setIsInfoModalVisible] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServicePackageInterface>({
    resolver: yupResolver(
      isEditServicePackage
        ? UpdateServicePackageValidationSchema()
        : CreateServicePackageValidationSchema()
    ),
  });

  //------------------LIFECYCLE------------------

  useEffect(() => {
    getServicePackages(cursor - 1)
      .then((result) => {
        setServicePackages(result.data.content);
        setTotalElements(result.data.totalElements);
        setLoading(false);
      })
      .catch((e) => {
        toastErrorNotification(e.response.data.message);
      });
  }, [cursor]);

  //------------------METHODS----------------

  const nextPage = (page: number) => {
    setCursor(page);
  };

  const handleEdit = (record: ServicePackageInterface) => {
    setIsEditServicePackage(true);
    reset(record);
    setIsModalOpen(true);
  };

  const handleDelete = (servicePackageId?: number | null) => {
    if (servicePackageId) {
      setLoading(true);
      deleteServicePackage(servicePackageId).then(() => {
        getServicePackages(cursor - 1)
          .then((result) => {
            setLoading(false);
            setServicePackages(result.data.content);
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
      servicePackageId: null,
      servicePackageName: "",
      termNumber: 0,
      servicePackageDurationDays: 0,
      price: 0,
      note: "",
    });
    setIsEditServicePackage(false);
    setIsModalOpen(false);
  };

  const handleCreateModal = () => {
    reset({
      servicePackageId: null,
      servicePackageName: "",
      termNumber: 0,
      servicePackageDurationDays: 0,
      price: 0,
      note: "",
    });
    setIsEditServicePackage(false);
    setIsModalOpen(true);
  };

  const handleOpenInfoModal = (note: string) => {
    setCurrentNote(note);
    setIsInfoModalVisible(true);
  };

  const handleCloseInfoModal = () => {
    setIsInfoModalVisible(false);
    setCurrentNote("");
  };

  const onSubmit = (data: ServicePackageInterface) => {
    console.log(data);
    setLoading(true);
    if (isEditServicePackage) {
      editServicePackage(data)
        .then((res) => {
          setServicePackages((prev) =>
            prev.map((item) =>
              item.servicePackageId == data.servicePackageId
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
      addServicePackage(data)
        .then(() => {
          getServicePackages(cursor - 1)
            .then((result) => {
              setLoading(false);
              setServicePackages(result.data.content);
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
    labelCol: { span: 9 },
    wrapperCol: { span: 15 },
  };

  const columns: ColumnsType<ServicePackageInterface> = [
    {
      title: "Naziv paketa usluge",
      dataIndex: "servicePackageName",
      key: "servicePackageName",
    },
    {
      title: "Broj termina",
      dataIndex: "termNumber",
      key: "termNumber",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Trajanje paketa u danima",
      dataIndex: "servicePackageDurationDays",
      key: "servicePackageDurationDays",
      render: (value) => {
        return value ? value : "Nema podatka";
      },
    },
    {
      title: "Cijena u KM",
      dataIndex: "price",
      key: "price",
      render: (value) => {
        return value ? value.toFixed(2) : "Nema podatka";
      },
    },
    {
      title: "Bilješka",
      dataIndex: "note",
      key: "note",
      render: (value) => {
        const previewText =
          value?.length > 3 ? value.slice(0, 3) + "..." : value;

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
            title="Da li ste sigurni da želite izbrisati ovaj paket usluge?"
            onConfirm={() => handleDelete(record.servicePackageId)}
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
        title={
          isEditServicePackage
            ? "Uredi paket usluge"
            : "Dodaj novi paket usluge"
        }
        maskClosable={false}
        open={isModalOpen}
        footer={null}
        onCancel={handleModalCancel}
      >
        <Form onFinish={handleSubmit(onSubmit)} {...layout}>
          <Form.Item
            label="Naziv paketa usluge"
            validateStatus={errors.servicePackageName ? "error" : ""}
            help={errors.servicePackageName?.message}
          >
            <Controller
              name="servicePackageName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Form.Item>

          <Form.Item
            label="Broj termina"
            validateStatus={errors.termNumber ? "error" : ""}
            help={errors.termNumber?.message}
          >
            <Controller
              name="termNumber"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0} style={{ width: "100%" }} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Broj dana trajanja paketa"
            validateStatus={errors.servicePackageDurationDays ? "error" : ""}
            help={errors.servicePackageDurationDays?.message}
          >
            <Controller
              name="servicePackageDurationDays"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0} style={{ width: "100%" }} />
              )}
            />
          </Form.Item>

          <Form.Item
            label="Cijena"
            validateStatus={errors.price ? "error" : ""}
            help={errors.price?.message}
          >
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={0}
                  step={0.01}
                  style={{ width: "100%" }}
                />
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
            Dodaj paket usluge
          </Button>
        </div>
        <FilterComponent showSearch={true} />
        <Table
          columns={columns}
          loading={loading}
          dataSource={servicePackages}
          rowKey="servicePackageId"
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

export default ServicePackagePage;
