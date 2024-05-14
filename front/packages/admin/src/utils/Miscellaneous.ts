export const serialize = (formData: FormData): { [key: string]: any } => {
  const array: Array<[string, any]> = [];
  for (let value of formData.entries()) {
    array.push(value);
  }

  const serialize = {} as { [key: string]: any };
  array.forEach(item => {
    const [key, value] = item;
    serialize[key] = value;
  });

  return serialize;
}


export const usernameRegex = new RegExp(/^[a-z0-9\-]{4,12}$/);
export const phoneRegex = new RegExp(/^01([016789])-?([0-9]{3,4})-?([0-9]{4})$/);
export const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/);
