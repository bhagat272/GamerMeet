import {
  DEVICE_INFO,
  logout,
  setGlobalUserToken,
  setUserData,
  showErrorMessage,
} from '../../utils/helper';
import {showToastMessage} from '../../utils/toast';
import {Delete, get, post, put} from '../apis/apiHelper';
import {
  JSON_HEADER,
  kUserData,
  kUserToken,
  MULTI_PART_HEADER,
} from '../apis/commonValue';
import {USER_SESSION_API} from '../apis/endpoints';
import {setData} from '../apis/keyChain';
import {loading} from '../reducer/loadingReducer';
import {userPayload} from '../reducer/userSessionReducer';
import {Dispatch} from 'redux';

type HttpMethod = 'POST' | 'PUT' | 'GET' | 'DELETE';

const repeatApiCall = async (
  request: object,
  maxAttempts: number = 3,
  url: string,
  method: HttpMethod = 'POST',
  header: object = JSON_HEADER,
  delay: number = 1000,
): Promise<any> => {
  let attempt = 0;

  const retry = async (): Promise<any> => {
    try {
      attempt++;
      let response;

      switch (method) {
        case 'POST':
          response = await post({url, data: JSON.stringify(request), header});
          break;
        case 'PUT':
          response = await put({url, data: request, header});
          break;
        case 'GET':
          response = await get({url, data: JSON.stringify(request), header});
          break;
        case 'DELETE':
          response = await Delete({url, data: JSON.stringify(request), header});
          break;
        default:
          throw new Error('Invalid HTTP Method');
      }

      if (
        response?.statusCode === 200 ||
        response?.statusCode === 201 ||
        response?.success ||
        response
      ) {
        return response;
      }

      if (attempt >= maxAttempts) {
        showToastMessage('Please try again later', 'danger');
      }

      await new Promise(res => setTimeout(res, delay * attempt));
      return retry();
    } catch (error) {
      if (attempt >= maxAttempts) {
        showToastMessage('Please try again later', 'danger');
      }

      await new Promise(res => setTimeout(res, delay * attempt));
      return retry();
    }
  };

  return retry();
};

export const saveUserData = (response: any, dispatch: Dispatch) => {
  setData(kUserData, response?.data);
  setUserData(response?.data);
  if (response?.data?.jwt_token) {
    setData(kUserToken, response?.data?.jwt_token);
    setGlobalUserToken(response?.data?.jwt_token);
  }

  dispatch(userPayload(response?.data));
};

export function checkUserAction(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.send_otp,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      if (response?.success) {
        showToastMessage(response?.message, 'success');
        return Promise.resolve(true);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function signupAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.register,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('response>>', response);

      if (response?.success) {
        showToastMessage(response?.message, 'success');
        saveUserData(response, dispatch);
        return Promise.resolve(true);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function loginAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.login,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('response>>login', response);

      if (response && response?.success) {
        showToastMessage(response?.message, 'success');
        saveUserData(response, dispatch);
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function forgotPasswordAction(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.send_otp,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('response>>', response);

      if (response?.success) {
        showToastMessage(response?.message, 'success');
        return Promise.resolve(true);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function verifyOTPAction(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.verify_otp,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.success) {
        showToastMessage(response?.message, 'success');
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}
export function verifyEmailAction(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.verify_email,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.success) {
        showToastMessage(response?.message, 'success');
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function resetPasswordAction(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.reset_password_token,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.success) {
        showToastMessage(response?.message, 'success');
        return Promise.resolve(true);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function profileAction(): any {
  return async (dispatch: any) => {
    try {
      const response = await get({
        url: USER_SESSION_API?.get_profile,
        data: JSON.stringify({}),
        header: JSON_HEADER,
      });
      console.log('response------->>', response);

      if (response && response?.success) {
        saveUserData(response, dispatch);
      } else {
        showToastMessage(response?.message, 'danger');
      }
    } catch (error) {
      showErrorMessage(`${error}`);
    }
  };
}

export function createEditProfileAction(request: object): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    console.log('request------', request);
    try {
      // const response = await put({
      //   url: USER_SESSION_API?.update_profile,
      //   data: request,
      //   header: MULTI_PART_HEADER,
      // });
      const response: any = await repeatApiCall(
        request,
        3,
        USER_SESSION_API?.update_profile,
        'PUT',
        MULTI_PART_HEADER,
      );
      console.log(response);

      dispatch(loading(false));
      if (response?.success) {
        saveUserData(response, dispatch);
        return Promise.resolve(true);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loading(false));
      console.log('update api error', error, '--------');
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function changePasswordAction(request: object): any {
  return async () => {
    try {
      const response = await post({
        url: USER_SESSION_API?.update_password,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log('response>>', response);

      if (response && response?.success) {
        showToastMessage(response?.message, 'success');
        return Promise.resolve(true);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function logoutAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.logout,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      console.log(response);

      dispatch(loading(false));
      if (response?.success) {
        showToastMessage(response?.message, 'success');
        logout(true);
        dispatch(userPayload(null));
      } else {
        console.log('else-->log', response);

        showToastMessage(response?.message);
      }
    } catch (error) {
      console.log('error-->log', error);

      dispatch(loading(false));
      showErrorMessage(`${error}`);
    }
  };
}

export function deleteAccountAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await Delete({
        url: USER_SESSION_API?.delete_account,
        header: JSON_HEADER,
        data: JSON.stringify(request),
      });

      dispatch(loading(false));
      if (response && response?.success) {
        showToastMessage(response?.message, 'success');
        logout(true);
        dispatch(userPayload(null));
      } else {
        showToastMessage(response?.message, 'danger');
      }
    } catch (error) {
      dispatch(loading(false));
      showErrorMessage(`${error}`);
    }
  };
}
export function manageProfilePictureAction(request: object): any {
  return async (dispatch: any) => {
    try {
      const response = await post({
        url: USER_SESSION_API?.manage_profile_picture,
        header: JSON_HEADER,
        data: JSON.stringify(request),
      });

      dispatch(loading(false));
      if (response && response?.status) {
        showToastMessage(response?.message, 'success');
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loading(false));
      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function deleteAvatarAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await Delete({
        url: USER_SESSION_API?.delete_avatar,
        data: request,
        header: JSON_HEADER,
      });
      dispatch(loading(false));

      if (response) {
        console.log(response, 'delete avatr---------->');

        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log('error----', error);

      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function blockedUsersListAction(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: USER_SESSION_API?.blocked_users,

        data: request,
        header: JSON_HEADER,
      });
      if (response) {
        console.log(response);

        return Promise.resolve(response);
      } else {
        console.log('------else----->', response);

        // showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log('error----', error);

      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function reportUserAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: USER_SESSION_API?.create_report,
        header: JSON_HEADER,
        data: JSON.stringify(request),
      });
      dispatch(loading(false));

      if (response) {
        console.log('Report log---------->', response);

        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log('error----', error);

      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}

export function updateFcmToken(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: USER_SESSION_API?.update_fcm_token,
        header: JSON_HEADER,
        data: JSON.stringify(request),
      });
      dispatch(loading(false));

      if (response) {
        console.log('fcm reposne==== ', response?.data?.firebase_token);
        // showToastMessage(response?.data?.message, 'success');
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message, 'danger');
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log('error----', error);

      showErrorMessage(`${error}`);
      return Promise.resolve(false);
    }
  };
}
