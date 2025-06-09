import { isValidPhoneNumber } from "react-phone-number-input";
import { ZodSchema, z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 15; // 15MB
const ACCEPTED_FILE_TYPES = ['image/png','image/jpeg','image/jpg', 'image/png','image/webp', 'application/pdf'];
const zodFileValidation = z.any()
  .refine(files => files?.length == 1, 'Ce fichier est obligatoire.')
  .refine(files => files ? ACCEPTED_FILE_TYPES.includes(files[0]?.type) : true, { message: 'Please choose PNG, JPEG or PDF format files only' })
  .refine(files => files ? files[0]?.size <= MAX_UPLOAD_SIZE : true, 'File size must be less than 15MB')

// Optional file validation for fields that will be required only in final registration
const zodOptionalFileValidation = z.any().optional();

export const applicationSchema: ZodSchema = z.object({
  /* Personal Informations */
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  dateOfBirth: z.date({ required_error: "A date of birth is required." }),
  massarCode: z.string().min(1).max(50),
  city: z.string().min(1).max(50),
  region: z.string().nonempty("Please select an option"),
  phoneNumber: z.string().refine(isValidPhoneNumber, { message: "Invalid phone number" }),
  guardianFullName: z.string().min(1).max(50),
  parentCNIE: z.string().min(1).max(50),
  guardianPhoneNumber: z.string().refine(isValidPhoneNumber, { message: "Numéro de téléphone invalide" }),
  relationshipWithGuardian: z.string().min(1).max(50),
  specialConditions: z.string().optional().refine((val) => {
    if (val) {
      return val.split(' ').length <= 100
    }
    return true;
  } , { message: "Maximum 100 mots"}),

  /* Education */
  highschool: z.string().min(1).max(50),
  averageGrade: z.string().min(1).max(50),
  physicsAverageGrade: z.string().min(1).max(50),
  ranking: z.string().min(1).max(50),
  physicsRanking: z.string().optional(),

  /* Competition */
  hasPreviouslyParticipated: z.enum(["yes", "no"], { required_error: "Please select an option." }),
  previousCompetitions: z.string().optional(),
  physicsOlympiadsParticipation: z.enum(["yes", "no"], { required_error: "Please select an option." }),
  olympiadsTrainingSelection: z.enum(["yes", "no"]).optional(),
  comments: z.string().optional().refine((val) => {
    if (val) {
      return val.split(' ').length <= 100
    }
    return true;
  } , { message: "Text can't be more than 100 words"}),

  /* Uploads */
  parentId: zodOptionalFileValidation,
  birthCertificate: zodOptionalFileValidation,
  schoolCertificate: zodFileValidation,
  grades: zodFileValidation,
  regulations: zodOptionalFileValidation,
  parentalAuthorization: zodOptionalFileValidation,
  imageRights: zodOptionalFileValidation,

  /* Terms of agreement */
  termsAgreement: z.boolean().default(false).refine(value => value === true, { message: "Vous devez accepter les Conditions Générales."}),
}).refine(
  (data) => true, // Remove the validation that makes olympiadsTrainingSelection required
  {
    message: "Please select whether you are selected for July training",
    path: ["olympiadsTrainingSelection"]
  }
);

export const getApplicationDefaultValues = (userData: any) => ({
  firstName: userData?.firstName || "",
  lastName: userData?.lastName || "",
  dateOfBirth: "",
  massarCode: "",
  city: "",
  region: "",
  phoneNumber: "",
  guardianFullName: "",
  parentCNIE: "",
  guardianPhoneNumber: "",
  relationshipWithGuardian: "",
  specialConditions: "",

  highschool: "",
  averageGrade: "",
  physicsAverageGrade: "",
  ranking: "",
  physicsRanking: "",

  hasPreviouslyParticipated: "",
  previousCompetitions: "",
  physicsOlympiadsParticipation: "",
  olympiadsTrainingSelection: undefined,
  comments: "",

  parentId: undefined,
  birthCertificate: undefined,
  schoolCertificate: undefined,
  grades: undefined,
  regulations: undefined,
  parentalAuthorization: undefined,
  imageRights: undefined,

  termsAgreement: false,
})