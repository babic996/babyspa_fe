import { baseRequest } from "../util/useAxios";
import { DEFAULT_PAGE_SIZE } from "../util/const";
import { ServicePackageInterface } from "../interfaces/ServicePackageInterface";

export const getServicePackages = async (cursor: number | null) => {
  const request = baseRequest();

  const result = await request({
    url: `/service-package/find-all?page=${cursor}&size=${DEFAULT_PAGE_SIZE}`,
    method: "get",
  });

  return result?.data;
};

export const getServicePackagesList = async () => {
  const request = baseRequest();

  const result = await request({
    url: "/service-package/find-all-list",
    method: "get",
  });

  return result?.data.data;
};

export const addServicePackage = (data: ServicePackageInterface) => {
  const request = baseRequest();

  return request({ url: "/service-package/save", method: "post", data: data });
};

export const editServicePackage = (data: ServicePackageInterface) => {
  const request = baseRequest();

  return request({ url: "/service-package/update", method: "put", data: data });
};

export const deleteServicePackage = (servicePackageId: number) => {
  const request = baseRequest();

  return request({
    url: `/service-package/delete?servicePackageId=${servicePackageId}`,
    method: "delete",
  });
};
