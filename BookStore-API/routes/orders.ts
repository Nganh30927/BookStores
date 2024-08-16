import express, { Express, Request, Response, query } from 'express';
const request = require('request');
import { sendJsonSuccess } from '../helpers/responseHandler';
import axios from 'axios';
import crypto from 'crypto';
import moment from 'moment';
import { AppDataSource } from '../data-source';
import { Order } from '../entities/orders.entity';
import { OrderDetail } from '../entities/orderdetails.entity';
import { Member } from '../entities/member.entity';
import config from '../constants/config';


const WAPI_URL = process.env.WEB_API_URL || `http://localhost:9000`;
const repository = AppDataSource.getRepository(Order);

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: any) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10; // Giới hạn từ query parameter
    const page = req.query.page ? parseInt(req.query.page as string) : 1; // Số lượng bản ghi cần bỏ qua từ query parameter

    const query = repository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.member', 'member')
      .leftJoinAndSelect('o.employee', 'employee')
      .leftJoinAndSelect('o.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.book', 'book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .select([
        'o.id',
        'o.orderday',
        'o.shippedday',
        'o.status',
        'o.shippingaddress',
        'o.paymenttype',
        'o.description',
        'o.employeeId',
        'o.memberId',
        'employee',
        'member',
        'orderDetails.orderId',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'orderDetails.subtotalorder',
        'book',
        'category',
      ]);

    const [orders, totalCount] = await query
      .orderBy('o.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const result = {
      orders,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      recordsPerPage: limit,
    };

    sendJsonSuccess(res)(result);
  } catch (error) {
    next(error);
  }
});

router.get('/personal/:id', async (req: Request, res: Response, next: any) => {
  try {
    const memberId = parseInt(req.params.id);

    if (isNaN(memberId)) {
      return res.status(400).send({ message: 'Invalid member ID' });
    }

    const orderRepository = AppDataSource.getRepository(Order);
    const query = orderRepository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.member', 'member')
      .leftJoinAndSelect('o.employee', 'employee')
      .leftJoinAndSelect('o.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.book', 'book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('o.memberId = :memberId', { memberId })
      .select([
        'o.id',
        'o.orderday',
        'o.shippedday',
        'o.status',
        'o.shippingaddress',
        'o.paymenttype',
        'o.description',
        'o.employeeId',
        'o.memberId',
        'employee',
        'member',
        'orderDetails.orderId',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'orderDetails.subtotalorder',
        'book',
        'category',
      ]);

    const orders = await query.getMany();

    if (!orders || orders.length === 0) {
      return res.status(404).send({ message: 'No orders found for this member' });
    }

    const amountResults = await orderRepository.count({ where: { memberId } });

    const result = {
      orders,
      amountResults,
    };

    sendJsonSuccess(res)(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const query = repository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.member', 'member')
      .leftJoinAndSelect('o.employee', 'employee')
      .leftJoinAndSelect('o.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.book', 'book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('o.id = :id', { id: req.params.id })
      .select([
        'o.id',
        'o.orderday',
        'o.shippedday',
        'o.status',
        'o.shippingaddress',
        'o.paymenttype',
        'o.description',
        'o.employeeId',
        'o.memberId',
        'employee',
        'member',
        'orderDetails.orderId',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'orderDetails.subtotalorder',
        'book',
        'category',
      ]);
    const orders = await query.getOne();

    const result = {
      orders,
    };

    if (!result) {
      return res.status(404).json({ error: 'Not found' });
    }
    sendJsonSuccess(res)(result);
  } catch (error) {
    next(error);
  }
});

// const createOrder = async (payload: any, queryRunner: any) => {
//   // Check if member already exists
//   let member = await queryRunner.manager.findOne(Member, { where: { email: payload.email } });

//   if (!member) {
//     // Create new Member if not exists
//     const createDataMember = {
//       name: payload.name,
//       email: payload.email,
//       contact: payload.contact,
//       address: payload.shippingaddress,
//     };
//     member = await queryRunner.manager.save(Member, createDataMember);
//   }

//   // Create Order
//   const createDataOrder = {
//     orderday: new Date(),
//     description: payload.description,
//     shippingaddress: payload.shippingaddress,
//     paymenttype: payload.paymenttype,
//     member: member, // Link the member to the order
//   };
//   const order = await queryRunner.manager.save(Order, createDataOrder);

//   return order;
// };

router.post('/', async (req: Request, res: Response, next: any) => {
  const queryRunner = repository.manager.connection.createQueryRunner();
  await queryRunner.connect();
  try {
    // Begin transaction
    await queryRunner.startTransaction();

    const order = req.body as Order;

    // Lưu thông tin order
    const result = await queryRunner.manager.save(Order, order);

    // Lưu thông tin order details
    const orderDetails = order.orderDetails?.map((od) => {
      return { ...od, orderId: result.id };
    });

    await queryRunner.manager.save(OrderDetail, orderDetails);

    // Commit transaction
    await queryRunner.commitTransaction();

    // Get order by id
    const savedOrder = await repository.findOne({ where: { id: result.id }, relations: ['orderDetails'] });

    // Send success response
    sendJsonSuccess(res)(savedOrder);
  } catch (error) {
    // Rollback transaction in case of error
    await queryRunner.rollbackTransaction();
    next(error); // Use next to pass the error to the error-handling middleware
  } finally {
    // Release query runner
    await queryRunner.release();
  }
});

router.patch('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await repository.findOne({ where: { id: orderId }, relations: ['orderDetails'] });
    if (!order) {
      return res.status(404).json({ error: 'Not found' });
    }

    const updatedOrderData = req.body as Order;
    const updatedOrder = repository.merge(order, updatedOrderData);

    // Update order details
    const orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    for (const detail of updatedOrderData.orderDetails) {
      const existingDetail = order.orderDetails.find((d) => d.orderId === detail.orderId && d.bookId === detail.bookId);
      if (existingDetail) {
        orderDetailRepository.merge(existingDetail, detail);
        await orderDetailRepository.save(existingDetail);
      } else {
        await orderDetailRepository.save(detail);
      }
    }

    await repository.save(updatedOrder);

    const result = await repository
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.member', 'member')
      .leftJoinAndSelect('o.employee', 'employee')
      .leftJoinAndSelect('o.orderDetails', 'orderDetails')
      .leftJoinAndSelect('orderDetails.book', 'book')
      .leftJoinAndSelect('book.category', 'category')
      .leftJoinAndSelect('book.publisher', 'publisher')
      .where('o.id = :id', { id: orderId })
      .select([
        'o.id',
        'o.orderday',
        'o.shippedday',
        'o.status',
        'o.shippingaddress',
        'o.paymenttype',
        'o.description',
        'o.employeeId',
        'o.memberId',
        'employee',
        'member',
        'orderDetails.quantity',
        'orderDetails.price',
        'orderDetails.discount',
        'orderDetails.subtotalorder',
        'book',
        'category',
      ])
      .getOne();

    sendJsonSuccess(res)(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: any) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await repository.findOne({ where: { id: orderId }, relations: ['orderDetails'] });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Delete order details
    const orderDetailRepository = AppDataSource.getRepository(OrderDetail);
    for (const detail of order.orderDetails) {
      await orderDetailRepository.remove(detail);
    }

    // Delete order
    await repository.remove(order);
    sendJsonSuccess(res)(order);
  } catch (error) {
    next(error);
  }
});

// PAYMENT MOMO
interface MomoRequestBody {
  partnerCode: string;
  partnerName: string;
  storeId: string;
  requestId: string;
  amount: string;
  orderId: string;
  orderInfo: string;
  redirectUrl: string;
  ipnUrl: string;
  lang: string;
  extraData: string;
  requestType: string;
  signature?: string;
}

function execPostRequest(url: any, data: any) {
  return axios
    .post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(JSON.stringify(data)).toString(),
      },
      timeout: 5000,
      timeoutErrorMessage: "Request timeout",
    })
    .then((response) => response.data);
}

router.post("/payment/momo", (req: Request, res: Response, next: any) => {
  console.log("««««« req »»»»»", req.body);
  const endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";

  const partnerCode = "MOMOBKUN20180529";
  const accessKey = "klm05TvNBzhg7h7j";
  const secretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
  const orderInfo = "Thanh toán qua MoMo";
  const amount = req.body.amount;
  const orderId = partnerCode + new Date().getTime();
  const redirectUrl = `${WAPI_URL}/checkout-done`;
  const ipnUrl = `${WAPI_URL}/checkout-done`;
  const extraData = "";

  const requestBody: MomoRequestBody = {
    partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: partnerCode + new Date().getTime(),
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    lang: "vi",
    extraData,
    requestType: "payWithATM",
  };

  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestBody.requestId}&requestType=${requestBody.requestType}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  requestBody.signature = signature;

  execPostRequest(endpoint, requestBody)
    .then((result) => {
      const payUrl = result.payUrl;
      sendJsonSuccess(res)(payUrl);
    })
    .catch((error) => {
      console.log("Request error:", error.message);
      next(error);
    });
});


//PAYMENT
router.post('/payment/create_vnpay_url', async (req: Request, res: Response, next: any) => {
  try {
    const ipAddr =
      req.headers['x-forwarded-for']?.toString() ||
      req.connection.remoteAddress || // Accessing remote address here
      req.socket?.remoteAddress; // Accessing remote address from socket

    const { vnp_TmnCode, vnp_HashSecret, vnp_Url } = config;
    const returnUrl = `${WAPI_URL}/orders/vnpay_return`;

    const date = moment();
    const createDate = date.format('YYYYMMDDHHmmss');
    const orderId = date.format('HHmmss');
    const amount = req.body.amount * 100;
    const bankCode = req.body.bankCode;
    const orderInfo = req.body.orderDescription;
    const orderType = req.body.orderType;
    const locale = req.body.language || 'vn';
    const currCode = 'VND';

    const vnp_Params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'payment',
      vnp_TmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr!,
      vnp_CreateDate: createDate,
      vnp_BankCode: bankCode,
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams['vnp_SecureHash'] = signed;

    const vnpUrlWithParams = `${vnp_Url}?${new URLSearchParams(sortedParams).toString()}`;
    res.send({ urlPay: vnpUrlWithParams });
  } catch (error) {
    console.error('Error creating VNPAY URL:', error);
    res.status(500).json({ error: 'Error creating VNPAY URL' });
  }
});

router.get("/vnpay_return", (req: Request, res: Response, next: any) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"] as string;

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  const { vnp_HashSecret } = config;
  const signData = new URLSearchParams(vnp_Params as Record<string, string>).toString();
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
});

router.get("/vnpay_ipn", (req: Request, res: Response, next: any) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"] as string;

  const orderId = vnp_Params["vnp_TxnRef"] as string;
  const rspCode = vnp_Params["vnp_ResponseCode"] as string;

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  const { vnp_HashSecret } = config;

  const signData = new URLSearchParams(vnp_Params as Record<string, string>).toString();
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  let paymentStatus = "0";

  const checkOrderId = true;
  const checkAmount = true;

  if (secureHash === signed) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === "0") {
          if (rspCode === "00") {
            res.status(200).json({ RspCode: "00", Message: "Success" });
          } else {
            res.redirect(`${WAPI_URL}/checkout`);
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
});

router.post("/querydr", (req: Request, res: Response, next: any) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  const date = new Date();

  const { vnp_TmnCode, vnp_HashSecret, vnp_Api } = config;

  const vnp_TxnRef = req.body.orderId;
  const vnp_TransactionDate = req.body.transDate;

  const vnp_RequestId = moment(date).format("HHmmss");
  const vnp_Version = "2.1.0";
  const vnp_Command = "querydr";
  const vnp_OrderInfo = `Truy van GD ma:${vnp_TxnRef}`;

  const vnp_IpAddr =
    req.headers["x-forwarded-for"]?.toString() ||
    req.connection.remoteAddress ||
    req.socket?.remoteAddress;

  const currCode = "VND";
  const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");

  const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;

  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    // @ts-ignore
    (error, response, body) => {
      console.log(response);
    }
  );
});

router.post("/refund", (req: Request, res: Response, next: any) => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  const date = new Date();

  const { vnp_TmnCode, vnp_HashSecret, vnp_Api } = config;

  const vnp_TxnRef = req.body.orderId;
  const vnp_TransactionDate = req.body.transDate;
  const vnp_Amount = req.body.amount * 100;
  const vnp_TransactionType = req.body.transType;
  const vnp_CreateBy = req.body.user;

  const currCode = "VND";

  const vnp_RequestId = moment(date).format("HHmmss");
  const vnp_Version = "2.1.0";
  const vnp_Command = "refund";
  const vnp_OrderInfo = `Hoan tien GD ma:${vnp_TxnRef}`;

  const vnp_IpAddr =
    req.headers["x-forwarded-for"]?.toString() ||
    req.connection.remoteAddress ||
    req.socket?.remoteAddress; //

  const vnp_CreateDate = moment(date).format("YYYYMMDDHHmmss");
  const vnp_TransactionNo = "0";

  const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TransactionType}|${vnp_TxnRef}|${vnp_Amount}|${vnp_TransactionNo}|${vnp_TransactionDate}|${vnp_CreateBy}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
  const hmac = crypto.createHmac("sha512", vnp_HashSecret);
  const vnp_SecureHash = hmac.update(Buffer.from(data, "utf-8")).digest("hex");

  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TransactionType,
    vnp_TxnRef,
    vnp_Amount,
    vnp_TransactionNo,
    vnp_CreateBy,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: "POST",
      json: true,
      body: dataObj,
    },
    // @ts-ignore
    (error, response, body) => {
      console.log(response);
    }
  );
});



// utils/sortObject.ts
export function sortObject(obj: Record<string, any>): Record<string, any> {
  const sortedObj: Record<string, any> = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sortedObj[key] = obj[key];
    });
  return sortedObj;
}

export interface Config {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_Url: string;
  vnp_Api: string;
}

export default router;
