import React, { useCallback, useEffect, useState } from "react";
import { Input, DatePicker, Select, Slider, InputNumber } from "antd";
import { useFilter } from "../../context/Filter/useFilter";
import { Dayjs } from "dayjs";
import debounce from "lodash/debounce";
import {
  getMaxPriceServicePackage,
  getServicePackagesList,
} from "../../services/ServicePackageService";
import { getBabiesList } from "../../services/BabyService";
import { ShortDetailsInterface } from "../../interfaces/ShortDetails";
import { getPaymentTypeList } from "../../services/PaymentTypeService";
import { PaymentTypeInterface } from "../../interfaces/PaymentTypeInterface";
import { getStatusList } from "../../services/StatusService";
import { StatusInterface } from "../../interfaces/StatusInterface";
const { RangePicker } = DatePicker;

interface FilterComponentProps {
  showSearch?: boolean;
  showDatePicker?: boolean;
  showSelectBebies?: boolean;
  showSelectServicePackages?: boolean;
  showRangePicker?: boolean;
  showTimeInRangePicker?: boolean;
  showPriceSlider?: boolean;
  showRemainingTerm?: boolean;
  showStatusSelect?: boolean;
  showPaymentTypeSelect?: boolean;
  statusTypeCode?: string;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  showSearch = false,
  showDatePicker = false,
  showSelectBebies = false,
  showRangePicker = false,
  showTimeInRangePicker = false,
  showPriceSlider = false,
  showSelectServicePackages = false,
  showRemainingTerm = false,
  showStatusSelect = false,
  showPaymentTypeSelect = false,
  statusTypeCode,
}) => {
  const { setFilter } = useFilter();
  const [maxPriceSlider, setMaxPriceSlider] = useState<number>(0);
  const [babies, setBabies] = useState<ShortDetailsInterface[]>([]);
  const [servicePackages, setServicePackages] = useState<
    ShortDetailsInterface[]
  >([]);
  const [paymentType, setPaymentType] = useState<PaymentTypeInterface[]>([]);
  const [statuses, setStatuses] = useState<StatusInterface[]>([]);

  useEffect(() => {
    getMaxPriceServicePackage().then((res) => setMaxPriceSlider(res));
    getBabiesList().then((res) => setBabies(res));
    getServicePackagesList().then((res) => setServicePackages(res));
    getPaymentTypeList().then((res) => setPaymentType(res));
    if (statusTypeCode) {
      getStatusList(statusTypeCode).then((res) => setStatuses(res));
    }
  }, []);

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates) {
      const [start, end] = dates;
      setFilter((prev) => ({
        ...prev,
        startRangeDate: start ? start.format("YYYY-MM-DDTHH:mm:ss") : null,
        endRangeDate: end ? end.format("YYYY-MM-DDTHH:mm:ss") : null,
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        startRangeDate: null,
        endRangeDate: null,
      }));
    }
  };

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setFilter((prev) => ({ ...prev, searchText: value }));
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleSearchChange(value);
  };

  const onChangeSlider = (value: number[]) => {
    setFilter((prev) => ({
      ...prev,
      startPrice: value[0],
      endPrice: value[1],
    }));
  };

  const handleRemainingTermInputChange = (value: number | null) => {
    setFilter((prev) => ({ ...prev, remainingTerm: value }));
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 16 }}>
      {showSearch && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <Input.Search
            placeholder="Pretraži..."
            onSearch={handleSearchChange}
            onChange={handleInputChange}
            style={{ width: "100%" }}
          />
        </div>
      )}
      {showRemainingTerm && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <InputNumber
            placeholder="Preostalo termina..."
            min={0}
            style={{ width: "100%" }}
            onChange={handleRemainingTermInputChange}
          />
        </div>
      )}
      {showDatePicker && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <DatePicker style={{ width: "100%" }} />
        </div>
      )}
      {showRangePicker && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <RangePicker
            format={showTimeInRangePicker ? "DD.MM.YYYY. HH:mm" : "DD.MM.YYYY."}
            onChange={handleRangeChange}
            style={{ width: "100%" }}
          />
        </div>
      )}
      {showSelectBebies && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <Select
            placeholder="Odaberi bebu"
            showSearch
            allowClear
            style={{ width: "100%" }}
            filterOption={(input, option) => {
              if (option && option.children) {
                const childrenString = Array.isArray(option.children)
                  ? option.children.join("")
                  : option.children;

                return (
                  typeof childrenString === "string" &&
                  childrenString.toLowerCase().includes(input.toLowerCase())
                );
              }
              return false;
            }}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                babyId: value,
              }));
            }}
          >
            {babies?.map((x) => (
              <Select.Option key={x.id} value={x.id}>
                {x.value}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
      {showSelectServicePackages && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <Select
            placeholder="Odaberi paket usluge"
            showSearch
            allowClear
            style={{ width: "100%" }}
            filterOption={(input, option) => {
              if (option && option.children) {
                const childrenString = Array.isArray(option.children)
                  ? option.children.join("")
                  : option.children;

                return (
                  typeof childrenString === "string" &&
                  childrenString.toLowerCase().includes(input.toLowerCase())
                );
              }
              return false;
            }}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                servicePackageId: value,
              }));
            }}
          >
            {servicePackages?.map((x) => (
              <Select.Option key={x.id} value={x.id}>
                {x.value}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
      {showPaymentTypeSelect && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <Select
            placeholder="Odaberi tip plaćanja"
            allowClear
            style={{ width: "100%" }}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                paymentTypeId: value,
              }));
            }}
          >
            {paymentType?.map((x) => (
              <Select.Option key={x.paymentTypeId} value={x.paymentTypeId}>
                {x.paymentTypeName}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
      {showStatusSelect && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <Select
            placeholder="Odaberi status"
            allowClear
            style={{ width: "100%" }}
            onChange={(value) => {
              setFilter((prev) => ({
                ...prev,
                statusId: value,
              }));
            }}
          >
            {statuses?.map((x) => (
              <Select.Option key={x.statusId} value={x.statusId}>
                {x.statusName}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
      {showPriceSlider && (
        <div
          style={{
            width: "20%",
            marginRight: 20,
            marginBottom: 16,
            flexShrink: 0,
          }}
        >
          <div style={{ marginBottom: 0, textAlign: "center" }}>
            <span style={{ fontSize: 14 }}>Raspon cijene</span>
          </div>
          <Slider
            range
            min={0}
            max={maxPriceSlider}
            step={0.1}
            defaultValue={[0, 30.0]}
            onChange={onChangeSlider}
          />
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
