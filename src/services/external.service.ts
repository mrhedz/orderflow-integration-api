import axios from 'axios';
import { env } from '../config/env';

export const sendOrderToExternal = async (payload: unknown) => {
  const response = await axios.post(
    `${env.externalApiUrl}/external/orders`,
    payload,
    {
      timeout: 5000,
    }
  );

  return response.data;
};