// @/stores/userStore.ts
import { IUser} from '@/apis/client/auth/types';
import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { create } from 'zustand';

const getCookieValue = (key: string): string => {
  const value = getCookie(key);
  return typeof value === 'string' ? value : '';
};

// Khởi tạo từ cookie
const initialAccess = getCookieValue('accessToken');
const initialType = getCookieValue('tokenType');
const initialExpires = (() => {
  const val = getCookieValue('expiresIn');
  const num = Number(val);
  return isNaN(num) ? 0 : num;
})();
const initialUserJson = getCookieValue('userData');
const initialUser: IUser | null = initialUserJson ? JSON.parse(initialUserJson) : null;

interface UserState {
  user: IUser | null;
  accessToken: string;
  tokenType: string;
  expiresIn: number;

  setUser: (u: IUser) => void;
  setTokens: (data: { access_token: string; token_type: string; expires_in: number }) => void;
  clearUser: () => void;
}

const useUserBaseStore = create<UserState>()((set) => ({
  user: initialUser,
  accessToken: initialAccess,
  tokenType: initialType,
  expiresIn: initialExpires,

  // CHỈ LƯU USER → role nằm trong user
  setUser: (u) => {
    set({ user: u });
    setCookie('userData', JSON.stringify(u));
  },

  setTokens: ({ access_token, token_type, expires_in }) => {
    set({
      accessToken: access_token,
      tokenType: token_type,
      expiresIn: expires_in,
    });
    setCookie('accessToken', access_token);
    setCookie('tokenType', token_type);
    setCookie('expiresIn', expires_in.toString());
  },

  clearUser: () => {
    set({
      user: null,
      accessToken: '',
      tokenType: '',
      expiresIn: 0,
    });
    deleteCookie('accessToken');
    deleteCookie('tokenType');
    deleteCookie('expiresIn');
    deleteCookie('userData'); // XÓA USER
  },
}));

// ĐỒNG BỘ COOKIE KHI STORE THAY ĐỔI
useUserBaseStore.subscribe((state, prevState) => {
  // Token
  if (state.accessToken !== prevState.accessToken) {
    if (state.accessToken) {
      setCookie("accessToken", state.accessToken);
    } else {
      deleteCookie("accessToken");
    }
  }

  if (state.tokenType !== prevState.tokenType) {
    if (state.tokenType) {
      setCookie("tokenType", state.tokenType);
    } else {
      deleteCookie("tokenType");
    }
  }

  if (state.expiresIn !== prevState.expiresIn) {
    if (state.expiresIn) {
      setCookie("expiresIn", state.expiresIn.toString());
    } else {
      deleteCookie("expiresIn");
    }
  }

  // User object
  if (state.user !== prevState.user) {
    if (state.user) {
      setCookie("userData", JSON.stringify(state.user));
    } else {
      deleteCookie("userData");
    }
  }
});


export const useUserStore = createSelectorHooks(useUserBaseStore);