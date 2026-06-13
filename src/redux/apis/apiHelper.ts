import axios from 'axios';
import {logout} from '../../utils/helper';
import {
  API_FAILED,
  BASE_URL,
  INTERNET_FAILED,
  JSON_HEADER,
  kDelete,
  kGet,
  kPost,
  kPut,
} from './commonValue';
import {isNetworkAvailable} from './network';

interface Params {
  method?: string;
  headers?: object;
  data?: object;
}

type ApiValues = {
  url?: string;
  data?: any;
  header: object | any;
};

// const methodFetchAccessToken = async (): Promise<string | boolean> => {
//   const header = JSON_HEADER;
//   // const dic = {refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'};
//   const params = {
//     method: kGet,
//     headers: {...header},
//     // auth_token: 'fed99da0-99d3-4f36-aec3-3e8e36f5c595'
//     // data: JSON.stringify(dic),
//   };

//   const accessToken: string | null | undefined = await getData(KAUthToken);
//   if (accessToken) {
//     return accessToken;
//   }

//   try {
//     const url = BASE_URL + APP_SESSION_API?.project_init;
//     console.log('response>>get_auth_token', url, params);
//     const response = await axios(url, params);

//     if (response) {
//       const token = response?.data?.data?.project_id;
//       console.log('response>=====>response', token, response);
//       saveAuthToken(token);
//       await setData(KAUthToken, token);
//       return token;
//     }
//     return false;
//   } catch (error) {
//     console.log('response>>response', error);
//     return false;
//   }
// };

const authToken = 'd959f724-5a35-4495-9116-72a436a8987c';

export const post = async ({url, data, header = JSON_HEADER}: ApiValues) => {
  if (!(await isNetworkAvailable())) {
    return INTERNET_FAILED;
  }
  //const authToken = await methodFetchAccessToken();
  console.log(authToken);

  let params: Params = {
    method: kPost,
    headers: {
      ...header,
      ...(global.userToken && {Authorization: `Bearer ${global.userToken}`}),
      ...{authtoken: authToken},
    },
    data: data,
  };
  console.log('BASE_URL + url, params>>', BASE_URL + url, params);

  try {
    const response = await axios(BASE_URL + url, params);

    // console.log('response vvvv------', response?.data);

    if ([401, 402, 404, 411].includes(response.status)) {
      logout(true);
    } else {
      console.log(';;;;;');
    }

    return response?.data;
  } catch (error: any) {
    if ([401, 402, 404, 411].includes(error?.response?.status)) {
      logout(true);
    }
    if (
      ['jwt expired', 'Your session has expired. Please log in again'].includes(
        error.response.data?.message,
      )
    ) {
      logout(true);
    }
    console.log('error------', error);
    return {
      status: false,
      message: error.response.data?.message,
      // };
      // logout(true);
    };
    return API_FAILED;
  }
};

export const put = async ({url, data, header = JSON_HEADER}: ApiValues) => {
  if (!(await isNetworkAvailable())) {
    return INTERNET_FAILED;
  }
  //const authToken = await methodFetchAccessToken();
  console.log({DATAAAAAAAA: data});

  let params: Params = {
    method: kPut,
    headers: {
      ...header,
      ...(userToken && {Authorization: `Bearer ${userToken}`}),
      ...{authtoken: authToken},
    },
    data: data,
  };
  console.log('BASE_URL + url, params>>', BASE_URL + url, params);

  try {
    const response = await axios(BASE_URL + url, params);
    // console.log('response vvvv------', response);
    if ([401, 402, 404, 411].includes(response.status)) {
      logout(true);
    }

    return response?.data;
  } catch (error: any) {
    if ([401, 402, 404, 411].includes(error?.response?.status)) {
      logout(true);
    }
    if (
      ['jwt expired', 'Your session has expired. Please log in again'].includes(
        error.response.data?.message,
      )
    ) {
      logout(true);
    }
    console.log('error------', error);
    return {
      status: false,
      message: error.response.data?.message,
      // };
      // logout(true);
    };
    return API_FAILED;
  }
};

export const Delete = async ({url, data, header = JSON_HEADER}: ApiValues) => {
  if (!(await isNetworkAvailable())) {
    return INTERNET_FAILED;
  }
  //const authToken = await methodFetchAccessToken();

  let params: Params = {
    method: kDelete,
    headers: {
      ...header,
      ...(userToken && {Authorization: `Bearer ${userToken}`}),
      ...{authtoken: authToken},
    },
    data: data,
  };
  console.log('BASE_URL + url, params>>', BASE_URL + url, params);

  try {
    const response = await axios(BASE_URL + url, params);

    if ([401, 402, 404, 411].includes(response.status)) {
      logout(true);
    }

    return response?.data;
  } catch (error: any) {
    if ([401, 402, 404, 411].includes(error?.response?.status)) {
      logout(true);
    }
    if (
      ['jwt expired', 'Your session has expired. Please log in again'].includes(
        error.response.data?.message,
      )
    ) {
      logout(true);
    }
    console.log('error------', error);
    return {
      status: false,
      message: error.response.data?.message,
      // };
      // logout(true);
    };
    return API_FAILED;
  }
};

export const get = async ({url}: ApiValues) => {
  if (!(await isNetworkAvailable())) {
    return INTERNET_FAILED;
  }

  //const authToken = await methodFetchAccessToken();

  let params: Params = {
    method: kGet,
    headers: {
      JSON_HEADER,
      ...{Authorization: `Bearer ${global.userToken}`},
      ...{authtoken: authToken},
      // ...(authToken && {authtoken: authToken}),
    },
  };

  try {
    const response = await axios(BASE_URL + url, params);

    if ([401, 402, 404, 411].includes(response.status)) {
      logout(true);
    }
    return response?.data;
  } catch (error: any) {
    if ([401, 402, 404, 411].includes(error?.response?.status)) {
      logout(true);
    }
    if (
      ['jwt expired', 'Your session has expired. Please log in again'].includes(
        error.response.data?.message,
      )
    ) {
      logout(true);
    }
    console.log('error---------->', error?.response?.status);
    return {
      status: false,
      message: error.response.data?.message,
      // };
      // logout(true);
    };
    return API_FAILED;
  }
};

export const Publicget = async ({url}: ApiValues) => {
  if (!(await isNetworkAvailable())) {
    return INTERNET_FAILED;
  }

  //const authToken = await methodFetchAccessToken();

  let params: Params = {
    method: kGet,
    headers: {
      JSON_HEADER,

      ...{authtoken: authToken},
      // ...(authToken && {authtoken: authToken}),
    },
  };

  try {
    const response = await axios(BASE_URL + url, params);

    if ([401, 402, 404, 411].includes(response.status)) {
      logout(true);
    }
    return response?.data;
  } catch (error: any) {
    if ([401, 402, 404, 411].includes(error?.response?.status)) {
      logout(true);
    }
    if (
      ['jwt expired', 'Your session has expired. Please log in again'].includes(
        error.response.data?.message,
      )
    ) {
      logout(true);
    }
    console.log('error---------->', error?.response?.status);
    return {
      status: false,
      message: error.response.data?.message,
      // };
      // logout(true);
    };
    return API_FAILED;
  }
};
