import React, { useState, useEffect } from "react";
import Select from "react-select";

export const UniversitySelect = () => {
  const [universities, setUniversities] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchUniversities = async () => {
      const response = await fetch(
        `https://api.data.gov/ed/collegescorecard/v1/schools.json?fields=school.name&school.name=${inputValue}&api_key=Dced9mxZyLP3S4hFeCtmTceVtEDBc2ztpeflkVqE`
      );
      const data = await response.json();
      setUniversities(
        data.results.map((element) => ({
          value: element["school.name"],
          label: element["school.name"],
        }))
      );
    };
    fetchUniversities();
  }, [inputValue]);

  const handleInputChange = (newValue) => {
    setInputValue(newValue);
  };

  return (
    <Select
      options={universities}
      onInputChange={handleInputChange}
      placeholder="Search for a university"
      {...register("university")}
    />
  );
};
