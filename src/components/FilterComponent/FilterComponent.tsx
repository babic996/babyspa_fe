import React, { useCallback } from "react";
import { Input, DatePicker, Select } from "antd";
import { useFilter } from "../../context/Filter/useFilter";
import { Dayjs } from "dayjs";
import debounce from "lodash/debounce";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterComponentProps {
  showSearch?: boolean;
  showDatePicker?: boolean;
  showSelect?: boolean;
  showRangePicker?: boolean;
  showTimeInRangePicker?: boolean;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  showSearch = false,
  showDatePicker = false,
  showSelect = false,
  showRangePicker = false,
  showTimeInRangePicker = true,
}) => {
  const { setFilter } = useFilter();

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

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
      {showSearch && (
        <Input.Search
          placeholder="Pretraži..."
          onSearch={handleSearchChange}
          onChange={handleInputChange}
          style={{ width: "25%", marginRight: 20 }}
        />
      )}
      {showDatePicker && (
        <DatePicker
          // value={date}
          // onChange={(date) => setDate(date)}
          style={{ width: "25%", marginRight: 20 }}
        />
      )}
      {showSelect && (
        <Select
          placeholder="Izaberi opciju"
          style={{ width: "25%", marginRight: 20 }}
        >
          <Option value="option1">Opcija 1</Option>
          <Option value="option2">Opcija 2</Option>
          <Option value="option3">Opcija 3</Option>
        </Select>
      )}
      {showRangePicker && (
        <RangePicker
          format={showTimeInRangePicker ? "DD.MM.YYYY. HH:mm" : "DD.MM.YYYY."}
          style={{ width: "25%", marginRight: 20 }}
          onChange={handleRangeChange}
        />
      )}
    </div>
  );
};

export default FilterComponent;
