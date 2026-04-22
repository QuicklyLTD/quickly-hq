import { Router } from 'express';
import { StoreAuthenticateGuard, StoreGuard, AccountGuard } from '../middlewares/store';
import { ReCaptchaCheck } from '../middlewares/menu';

import * as MenuController from '../controllers/menu/menu';

const router = Router();

router.post("/comment/new",
    StoreGuard,
    MenuController.menuComment);

router.get("/comments/:storeId",
    MenuController.listComments);

router.post("/reservation/:storeId",
    MenuController.createReservation);

router.post("/check/:token",
    StoreGuard,
    MenuController.checkRequest);

router.post("/payment/:token",
    StoreGuard,
    MenuController.payReceipt);

router.get("/slug/:slug",
    MenuController.requestMenuFromSlug);

module.exports = router;