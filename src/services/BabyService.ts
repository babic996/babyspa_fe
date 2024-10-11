import { baseRequest } from "../util/useAxios";
import { DEFAULT_PAGE_SIZE } from "../util/const";
import { BabyInterface } from "../interfaces/BabyInterface";

export const getBabies = async (cursor: number | null) => {
  const request = baseRequest();

  const result = await request({
    url: `/baby/find-all?page=${cursor}&size=${DEFAULT_PAGE_SIZE}`,
    method: "get",
  });

  return result?.data;
};

export const getBabiesList = async () => {
  const request = baseRequest();

  const result = await request({
    url: "/baby/find-all-list",
    method: "get",
  });

  return result?.data.data;
};

export const addBaby = (data: BabyInterface) => {
  const request = baseRequest();

  return request({ url: "/baby/save", method: "post", data: data });
};

export const editBaby = (data: BabyInterface) => {
  const request = baseRequest();

  return request({ url: "/baby/update", method: "put", data: data });
};

export const deleteBaby = (babyId: number) => {
  const request = baseRequest();

  return request({
    url: `/baby/delete?babyId=${babyId}`,
    method: "delete",
  });
};
