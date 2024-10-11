import { baseRequest } from "../util/useAxios";
import { DEFAULT_PAGE_SIZE } from "../util/const";
import { CreateOrUpdateArrangementInterface } from "../interfaces/ArrangementInterface";

export const getArrangements = async (cursor: number | null) => {
  const request = baseRequest();

  const result = await request({
    url: `/arrangement/find-all?page=${cursor}&size=${DEFAULT_PAGE_SIZE}`,
    method: "get",
  });

  return result?.data;
};

export const getArrangementsList = async () => {
  const request = baseRequest();

  const result = await request({
    url: "/arrangement/find-all-list",
    method: "get",
  });

  return result?.data.data;
};

export const addArrangement = (data: CreateOrUpdateArrangementInterface) => {
  const request = baseRequest();

  return request({ url: "/arrangement/save", method: "post", data: data });
};

export const editArrangement = (data: CreateOrUpdateArrangementInterface) => {
  const request = baseRequest();

  return request({ url: "/arrangement/update", method: "put", data: data });
};

export const deleteArrangement = (arrangementId: number) => {
  const request = baseRequest();

  return request({
    url: `/arrangement/delete?arrangementId=${arrangementId}`,
    method: "delete",
  });
};
