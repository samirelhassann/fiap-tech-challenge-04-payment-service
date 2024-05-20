/* eslint-disable @typescript-eslint/naming-convention */
import { env } from "@/config/env";
import { IPaymentService } from "@/core/interfaces/services/IPaymentService";

import api from "./api";
import { OrderToCreatePaymentRequestConverter } from "./converters/OrderToCreatePaymentRequestConverter";
import { CreatePaymentResponse } from "./model/CreatePaymentResponse";
import { CreatePaymentProps } from "./model/CretePaymentProps";
import { GetOrderStatusResponse } from "./model/GetOrderStatusResponse";

export class MercadoPagoService implements IPaymentService {
  async createPayment(paymentInfos: CreatePaymentProps): Promise<{
    paymentDetails: string;
  }> {
    const ENDPOINT =
      "/instore/orders/qr/seller/collectors/{userId}/pos/{externalPOSId}/qrs";

    const request = OrderToCreatePaymentRequestConverter.convert(paymentInfos);

    const { data } = await api.post<CreatePaymentResponse>(
      ENDPOINT.replace("{userId}", env.MERCADO_PAGO_USER_ID).replace(
        "{externalPOSId}",
        env.MERCADO_PAGO_EXTERNAL_POS_ID
      ),
      request
    );

    const { qr_data: qrCode } = data;

    return {
      paymentDetails: qrCode,
    };
  }

  async getOrderStatus(
    platformOrderId: string
  ): Promise<{ status: string; orderId: string }> {
    const ENDPOINT = "merchant_orders/{platformOrderId}";

    const { data } = await api.get<GetOrderStatusResponse>(
      ENDPOINT.replace("{platformOrderId}", platformOrderId)
    );

    const { order_status: status, external_reference: orderId } = data;

    return {
      status,
      orderId,
    };
  }
}
