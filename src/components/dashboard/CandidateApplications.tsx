import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  AlertCircle,
  PlusCircle
} from "lucide-react";

interface Application {
  _id: string;
  name: string;
  StudentId: string;
  email: string;
  phone: string;
  statement: string;
  position: string;
  status: "pending" | "approved" | "rejected";
  electionId: {
    _id: string;
    title: string;
    post: string;
    active: boolean;
  };
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

const CandidateApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/my-applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        const errorData = await response.json();
        setAlert({ type: "error", message: errorData.message || "Failed to fetch applications" });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setAlert({ type: "error", message: "An error occurred while fetching applications" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteApplication = async (applicationId: string) => {
    if (!confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/application/${applicationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAlert({ type: "success", message: "Application deleted successfully" });
        fetchMyApplications(); // Refresh the list
      } else {
        const errorData = await response.json();
        setAlert({ type: "error", message: errorData.message || "Failed to delete application" });
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      setAlert({ type: "error", message: "An error occurred while deleting the application" });
    } finally {
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-orange-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {alert && (
        <Alert className={alert.type === "error" ? "border-red-500" : "border-green-500"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">My Applications</h2>
          <Badge variant="outline" className="text-sm">
            {applications.length} Applications
          </Badge>
        </div>
        <Button onClick={() => (window.location.href = "/dashboard/user?tab=candidate")}>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Application
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">No Applications Yet</p>
            <p className="text-gray-500">You haven't submitted any candidate applications.</p>
            <Button
              className="mt-4"
              onClick={() => (window.location.href = "/dashboard/user?tab=candidate")}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Application
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <motion.div
              key={application._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{application.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {application.electionId.title} - {application.position}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Student ID: {application.StudentId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Contact Information</p>
                      <p className="text-sm">{application.email}</p>
                      <p className="text-sm">{application.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">Campaign Statement</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {application.statement}
                      </p>
                    </div>

                    {application.status === "rejected" && application.rejectionReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{application.rejectionReason}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs text-gray-500">
                        <p>Applied: {new Date(application.createdAt).toLocaleString()}</p>
                        <p>Updated: {new Date(application.updatedAt).toLocaleString()}</p>
                      </div>

                      {application.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.location.href = `/dashboard/user?tab=candidate&edit=${application._id}`;
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteApplication(application._id)}
                            className="text-red-600 hover:text-red-700 border-red-200"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateApplications;
