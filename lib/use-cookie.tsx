import { useCallback, useState, useEffect } from "react";
import Cookies from "js-cookie";

const useCookie = (
  cookieName: string
): [
  string | null,
  (newValue: string, options?: Cookies.CookieAttributes) => void,
  () => void
] => {
  const [value, setValue] = useState<string | null>(
    () => Cookies.get(cookieName) || null
  );

  // Listen for cookie changes from other components
  useEffect(() => {
    const handleCookieChange = (
      event: CustomEvent<{ name: string; value: string | null }>
    ) => {
      if (event.detail.name === cookieName) {
        setValue(event.detail.value);
      }
    };

    // TypeScript requires type assertion for CustomEvent
    window.addEventListener(
      `cookie-change-${cookieName}`,
      handleCookieChange as EventListener
    );
    return () => {
      window.removeEventListener(
        `cookie-change-${cookieName}`,
        handleCookieChange as EventListener
      );
    };
  }, [cookieName]);

  const updateCookie = useCallback(
    (newValue: string, options?: Cookies.CookieAttributes) => {
      Cookies.set(cookieName, newValue, options);
      setValue(newValue);

      // Dispatch event to notify other components
      window.dispatchEvent(
        new CustomEvent(`cookie-change-${cookieName}`, {
          detail: { name: cookieName, value: newValue },
        })
      );
    },
    [cookieName]
  );

  const deleteCookie = useCallback(() => {
    Cookies.remove(cookieName);
    setValue(null);

    // Dispatch event to notify other components
    window.dispatchEvent(
      new CustomEvent(`cookie-change-${cookieName}`, {
        detail: { name: cookieName, value: null },
      })
    );
  }, [cookieName]);

  return [value, updateCookie, deleteCookie];
};

export default useCookie;
