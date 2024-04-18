import { Op, WhereOptions } from 'sequelize';
import * as crypto from 'crypto';

import { ResponseInterface } from 'common/interfaces/response.interface';
import { PaginationObjectInterface } from 'common/interfaces/pagination.interface';
import { PAGINATION_DEFAULT_LIMIT } from 'constants/config';
import { PaginationDto } from 'common/dto/pagination.dto';

export const generateResponse = <T = any>(
  resData: T = null,
  message = 'success',
  status = 200,
): ResponseInterface<T> => {
  return <ResponseInterface<T>>(<unknown>{
    status,
    resData,
    message: message,
  });
};

export const mapPagination = (input: PaginationDto): PaginationObjectInterface => {
  let { limit, page } = input;

  if (!limit || limit < 1) {
    limit = PAGINATION_DEFAULT_LIMIT;
  }

  if (!page || page < 1) {
    page = 1;
  }

  limit = Number(limit);
  const offset = (Number(page) - 1) * limit;

  return { limit, offset };
};

export const includeSearchConditions = <T = any>(
  fields: string[],
  search: string,
  where: WhereOptions<T> = null,
): WhereOptions<T> => {
  const whereWithSearchConditions: WhereOptions<T> = { ...where, [Op.or]: {} } || { [Op.or]: {} };

  fields.forEach((field) => {
    whereWithSearchConditions[Op.or][field] = {
      [Op.like]: `%${search}%`,
    };
  });

  return whereWithSearchConditions;
};

export const hash = (data: any): string => {
  const dataString = JSON.stringify(data);
  const hashObject = crypto.createHash('sha256');
  hashObject.update(dataString);

  return hashObject.digest('hex');
};

export const areNumberArraysEqual = (firstArray: Array<number>, secondArray: Array<number>): boolean => {
  if (firstArray.length !== secondArray.length) {
    return false;
  }

  const sortedArr1 = firstArray.slice().sort();
  const sortedArr2 = secondArray.slice().sort();

  for (let i = 0; i < sortedArr1.length; i++) {
    if (sortedArr1[i] !== sortedArr2[i]) {
      return false;
    }
  }

  return true;
};

export const getUniqueNumbersFromArray = (arrayToCompare: Array<number>, inputArray: Array<number>): Array<number> => {
  const arrayToCompareSet = new Set(arrayToCompare);
  const inputArraySet = new Set(inputArray);

  return [...inputArraySet].filter((num: number) => !arrayToCompareSet.has(num));
};

export const pluck = <T = any, K = any>(obj: T[], field = 'id'): K[] =>
  Array.isArray(obj) ? obj.map((o: T) => o[field]) : [];

export const convertCamelCaseToSentence = (input: string): string => {
  return input.replace(/([A-Z])/g, ' $1').trim();
};

export const isObjectEmpty = (obj: Record<string, any>): boolean => {
  // Check if the value is an object
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // Check if the object is empty
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
};

export const falsyToNull = (value: any) => {
  const conditionList = [value instanceof Array && !value.length, !value, isObjectEmpty(value)];

  return conditionList.some((item: boolean) => item) ? null : value;
};

export const filterDuplicates = <T = any>(array: Array<T>, property: keyof Array<T>[0]) => {
  const seen = new Set();
  return array.filter((item) => {
    if (seen.has(item[property])) {
      return false;
    } else {
      seen.add(item[property]);
      return true;
    }
  });
};

export const generateRandomHash = () => {
  return crypto.randomBytes(10).toString('hex');
};
