// types/custom.types.ts
import {
   IsInt,
   IsNotEmpty,
   IsDateString,
   IsString,
   IsBoolean,
   IsOptional,
} from "class-validator";

export class CreateBookingDto {
   @IsString()
   @IsNotEmpty()
   parkingSlotId: string;

   @IsString()
   @IsNotEmpty()
   vehicleId: string;

   @IsDateString()
   @IsNotEmpty()
   startTime: string;
}

export class ExtendBookingDto {
   @IsString()
   @IsNotEmpty()
   bookingId: string;

   @IsInt()
   @IsNotEmpty()
   additionalHours: number;
}

export class CreateUserDto {
   @IsNotEmpty()
   email: string;

   @IsNotEmpty()
   password: string;

   @IsNotEmpty()
   firstName: string;

   @IsNotEmpty()
   lastName: string;
}

export class LoginDto {
   @IsNotEmpty()
   email: string;

   @IsNotEmpty()
   password: string;
}

export class CreateParkingSlotDto {
   @IsString()
   @IsNotEmpty()
   number: string;
   @IsInt()
   @IsNotEmpty()
   floor: number;
   @IsBoolean()
   @IsOptional()
   isAvailable?: boolean;
}

export interface AuthRequest extends Request {
   user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
   };
}
