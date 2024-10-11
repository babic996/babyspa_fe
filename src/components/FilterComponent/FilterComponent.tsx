import React from "react";
import { Input, DatePicker, Select } from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterComponentProps {
  showSearch?: boolean;
  showDatePicker?: boolean;
  showSelect?: boolean;
  showRangePicker?: boolean;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  showSearch = false,
  showDatePicker = false,
  showSelect = false,
  showRangePicker = false, // Podrazumevano da prikaže
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
      {showSearch && (
        <Input.Search
          placeholder="Pretraži..."
          // value={inputText}
          // onChange={(e) => setInputText(e.target.value)}
          style={{ width: "25%", marginRight: 20 }} // Postavi širinu na 25%
        />
      )}
      {showDatePicker && (
        <DatePicker
          // value={date}
          // onChange={(date) => setDate(date)}
          style={{ width: "25%", marginRight: 20 }} // Postavi širinu na 25%
        />
      )}
      {showSelect && (
        <Select
          placeholder="Izaberi opciju"
          style={{ width: "25%", marginRight: 20 }} // Postavi širinu na 25%
        >
          <Option value="option1">Opcija 1</Option>
          <Option value="option2">Opcija 2</Option>
          <Option value="option3">Opcija 3</Option>
        </Select>
      )}
      {showRangePicker && (
        <RangePicker
          // value={dateRange}
          // onChange={(dates) => setDateRange(dates)}
          style={{ width: "25%", marginRight: 20 }} // Postavi širinu na 25%
        />
      )}
    </div>
  );
};

export default FilterComponent;
