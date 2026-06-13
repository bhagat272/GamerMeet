import {showErrorMessage} from '../../utils/helper';
import {showToastMessage} from '../../utils/toast';
import {get, post} from '../apis/apiHelper';
import {JSON_HEADER, MULTI_PART_HEADER} from '../apis/commonValue';
import {APP_SESSION_API} from '../apis/endpoints';
import {loading} from '../reducer/loadingReducer';

export function chatMediaUploadAction(request: any): any {
  return async () => {
    try {
      const response = await post({
        url: APP_SESSION_API?.upload_chat_media,
        data: request,
        header: MULTI_PART_HEADER,
      });
      if (response) {
        console.log(response, 'file upload');
        // showToastMessage(response?.message, 'success');
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

export function userListForChatAction(): any {
  return async () => {
    try {
      const response = await get({
        url: APP_SESSION_API?.user_list,
        header: JSON_HEADER,
        data: {},
      });
      if (response && response?.status) {
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

export function createGroupAction(request: any): any {
  return async () => {
    try {
      const response = await post({
        url: APP_SESSION_API?.create_group,
        header: MULTI_PART_HEADER,
        data: request,
      });
      if (response && response?.status) {
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

export function getFavoriteGame(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: APP_SESSION_API?.get_favorite_game,
        header: JSON_HEADER,
        data: request,
      });
      if (response) {
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

export function getGender(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: `${APP_SESSION_API?.get_gender}?isActive=${request.isActive}`,
        header: JSON_HEADER,
        data: request,
      });
      if (response) {
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

export function getGamingPlatform(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: APP_SESSION_API?.get_game_platform,
        header: JSON_HEADER,
        data: request,
      });
      if (response) {
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

export function getGamingGenre(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: APP_SESSION_API?.get_game_genre,
        header: JSON_HEADER,
        data: request,
      });
      if (response) {
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

export function getPlayingStyle(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: APP_SESSION_API?.get_playing_style,
        header: JSON_HEADER,
        data: request,
      });
      if (response) {
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

export function getGameSchedule(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: APP_SESSION_API?.get_game_schedule,
        header: JSON_HEADER,
        data: request,
      });
      if (response) {
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

//home
export function homePageAction(request: any): any {
  return async () => {
    try {
      const response = await post({
        url: APP_SESSION_API?.home_page,
        data: request,
        header: JSON_HEADER,
      });

      if (response) {
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

//gamer detail
export function gamerDetailAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));

    try {
      const response = await post({
        url: APP_SESSION_API?.gamer_detail,
        data: request,
        header: JSON_HEADER,
      });

      if (response) {
        dispatch(loading(false));
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
export function likeDislikeAction(request: any): any {
  return async (dispatch: any) => {
    dispatch(loading(true));
    try {
      const response = await post({
        url: APP_SESSION_API?.like_dislike,
        data: request,
        header: JSON_HEADER,
      });
      dispatch(loading(false));
      if (response) {
        console.log('like dislike response=====', response);
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

//browse game list
export function browseGamerAction(request: any): any {
  return async () => {
    try {
      const response = await post({
        url: APP_SESSION_API?.browse_gamer_list,
        data: request,
        header: JSON_HEADER,
      });
      if (response) {
        console.log('====>browser', response?.data);
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

//connection api
export function mutualConnectionAction(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: `${APP_SESSION_API?.mutual_connection}?page=${request?.page || 1}`,

        data: request,
        header: JSON_HEADER,
      });
      if (response) {
        console.log(
          '==========MUTUAL======CONNECTION SCRREN REFETCH CALL====================',
          response,
        );
        return Promise.resolve(response);
      } else {
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

export function pendingInterestAction(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: `${APP_SESSION_API?.pending_interest}?page=${request?.page || 1}`,

        data: request,
        header: JSON_HEADER,
      });
      if (response) {
        return Promise.resolve(response);
      } else {
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

export function pendingRequestAction(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: `${APP_SESSION_API?.pending_request}?page=${request?.page || 1}`,

        data: request,
        header: JSON_HEADER,
      });
      if (response) {
        console.log(
          '================CONNECTION SCRREN REFETCH CALL====================',
          response,
        );
        return Promise.resolve(response);
      } else {
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

export function notificationListAction(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: `${APP_SESSION_API?.notification_list}?page=${request?.page || 1}`,

        data: request,
        header: JSON_HEADER,
      });
      if (response) {
        return Promise.resolve(response);
      } else {
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

export function getNotificationCount(request: any): any {
  return async () => {
    try {
      const response = await get({
        url: APP_SESSION_API?.notification_count,
        header: JSON_HEADER,
        data: request,
      });
      if (response) {
        console.log(
          'notification count---->',
          response?.data?.notificationCount,
        );
        return Promise.resolve(response?.data?.notificationCount);
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

export function notificationReadAction(request: any): any {
  return async () => {
    try {
      const response = await post({
        url: APP_SESSION_API?.notification_read,
        data: request,
        header: JSON_HEADER,
      });
      if (response && response?.success) {
        console.log('respones of notification count', response);

        // showToastMessage(response?.message, 'success');
        return Promise.resolve(response);
      } else {
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
