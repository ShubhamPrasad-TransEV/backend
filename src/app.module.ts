import { Module } from '@nestjs/common';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { ProductsModule } from './modules/products/products.module';
import { CartModule } from './modules/cart/cart.module';
import { AnalyticsModule } from './modules/analytics/analytics.modules';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CategoriesModule } from './modules/category/category.module';
import { NotificationModule } from './modules/notification/notification.module';
import { StoreModule } from './modules/store/store.module';
import { AdminSettingsModule } from './modules/admin-settings/admin-settings.module'; // New module for admin settings
import { OperationalSettingsModule } from './modules/operational-settings/operational-settings.module'; // Import OperationalSettingsModule
import { OrderModule } from './modules/orders/order.module';
import { PopularAnalyticsModule } from './modules/popularanalytics/popularaanalytics.modules';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { SupportModule } from './modules/support/support.module';
import { OfferModule } from './modules/offer/offer.module';
import { PincodeModule } from './modules/pincode/pincode.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { TopRatedModule } from './modules/top-rated/top-rated.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Configures the configuration globally
    }),
    PrismaModule,
    RoleModule,
    AdminModule,
    AuthModule,
    ProductsModule,
    CartModule,
    CategoriesModule,
    NotificationModule,
    StoreModule,
    AdminSettingsModule, // Added AdminSettingsModule
    OperationalSettingsModule, // Added OperationalSettingsModule
    OrderModule,
    WishlistModule,
    AnalyticsModule,
    PopularAnalyticsModule,
    ReviewsModule,
    SupportModule,
    OfferModule,
    PincodeModule,
    CollectionsModule,
    TopRatedModule
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
