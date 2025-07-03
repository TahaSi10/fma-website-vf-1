import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/shared/table";
import Link from "next/link";
import { FileIcon } from "@/components/shared/icons";
import FileStatus from "./file-status";
import { useState, useEffect } from "react";
import { getToken } from '@/lib/utils';

const FileCard = ({
  href,
}:{
  href: string,
}) => {
  const [presignedUrl, setPresignedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Create a function to get presigned URL
    const getFileUrl = async () => {
      if (!href) {
        console.log("No href provided for FileCard");
        setError("No file path provided");
        setLoading(false);
        return;
      }

      try {
        const token = getToken();
        console.log("Getting presigned URL for:", href);
        
        // Call your API endpoint to get a presigned URL
        const response = await fetch('/api/media/get-presigned-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ key: href }),
        });
        
        const data = await response.json();
        console.log("Presigned URL response:", data);
        
        if (data.url) {
          setPresignedUrl(data.url);
        } else {
          setError("Failed to get file URL");
          console.error("No URL in response:", data);
        }
      } catch (error) {
        setError("Error retrieving file");
        console.error("Error getting presigned URL:", error);
      } finally {
        setLoading(false);
      }
    };

    getFileUrl();
  }, [href]);

  return (
    <Link
      href={presignedUrl || "#"}
      target='_blank'
      className={loading || !presignedUrl ? "pointer-events-none opacity-50" : ""}
    >
      <div 
        className='w-[6rem] h-[6rem] rounded-xl border flex flex-col justify-center items-center space-y-2 cursor-pointer hover:bg-gray-100'
      >
        {loading ? (
          <span className="animate-pulse">Loading...</span>
        ) : error ? (
          <span className="text-xs text-red-500 text-center px-1">{error}</span>
        ) : (
          <FileIcon />
        )}
      </div>
    </Link>
  )
}

export default function FilesTable({ application }: { application: any }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow key='parent-id' className="bg-blue-50">
          <TableCell className="font-medium">
            Parent ID 
            <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-blue-600 block">Required</span>
          </TableCell>
          <TableCell><FileCard href={application?.parentIdUrl} /></TableCell>
          <TableCell><FileStatus slug='parentId' application={application} /></TableCell>
        </TableRow>

        <TableRow key='birth-certificate' className="bg-blue-50">
          <TableCell className="font-medium">
            Birth Certificate
            <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-blue-600 block">Required</span>
          </TableCell>
          <TableCell><FileCard href={application?.birthCertificateUrl} /></TableCell>
          <TableCell><FileStatus slug='birthCertificate' application={application} /></TableCell>
        </TableRow>

        <TableRow key='school-certificate' className="bg-gray-50">
          <TableCell className="font-medium">
            School Certificate
            <span className="text-xs text-gray-600 block">Application Document</span>
          </TableCell>
          <TableCell><FileCard href={application?.schoolCertificateUrl} /></TableCell>
          <TableCell><FileStatus slug='schoolCertificate' application={application} /></TableCell>
        </TableRow>

        <TableRow key='grades' className="bg-gray-50">
          <TableCell className="font-medium">
            Grades
            <span className="text-xs text-gray-600 block">Application Document</span>
          </TableCell>
          <TableCell><FileCard href={application?.gradesUrl} /></TableCell>
          <TableCell><FileStatus slug='grades' application={application} /></TableCell>
        </TableRow>

        <TableRow key='regulations' className="bg-blue-50">
          <TableCell className="font-medium">
            Regulations
            <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-blue-600 block">Required</span>
          </TableCell>
          <TableCell><FileCard href={application?.regulationsUrl} /></TableCell>
          <TableCell><FileStatus slug='regulations' application={application} /></TableCell>
        </TableRow>

        <TableRow key='parental-authorization' className="bg-blue-50">
          <TableCell className="font-medium">
            Parental Authorization
            <span className="text-red-500 ml-1">*</span>
            <span className="text-xs text-blue-600 block">Required</span>
          </TableCell>
          <TableCell><FileCard href={application?.parentalAuthorizationUrl} /></TableCell>
          <TableCell><FileStatus slug='parentalAuthorization' application={application} /></TableCell>
        </TableRow>

        <TableRow key='image-rights' className="bg-yellow-50">
          <TableCell className="font-medium">
            Image Rights
            <span className="text-xs text-yellow-600 block">Optional (Legacy)</span>
          </TableCell>
          <TableCell><FileCard href={application?.imageRightsUrl} /></TableCell>
          <TableCell><FileStatus slug='imageRights' application={application} /></TableCell>
        </TableRow>

        <TableRow key='report' className="bg-green-50">
          <TableCell className="font-medium">
            Report
            <span className="text-xs text-green-600 block">Final Submission</span>
          </TableCell>
          <TableCell><FileCard href={application?.reportUrl} /></TableCell>
          <TableCell><FileStatus slug='report' application={application} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
