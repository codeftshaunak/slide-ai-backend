import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
  
  @Injectable()
  export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const user = request.user; // Assuming the JWT guard or another auth guard has set the user on the request
  
      if (user) {
        // You can attach the user or specific fields to the request
        request.userId = user.id; // Automatically add userId to the request
        request.userEmail = user.email; // Add userEmail if needed
        // You can add more fields based on your needs
      }
  
      return next.handle(); // Proceed with the request
    }
  }
  