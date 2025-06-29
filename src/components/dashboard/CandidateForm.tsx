import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, AlertCircle } from "lucide-react";

const formSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  studentId: z
    .string()
    .min(5, { message: "Student ID must be at least 5 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  position: z.string().min(1, { message: "Please select a position." }),
  statement: z
    .string()
    .min(50, { message: "Statement must be at least 50 characters." })
    .max(500, { message: "Statement must not exceed 500 characters." }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
});

type FormValues = z.infer<typeof formSchema>;

interface CandidateFormProps {
  onSubmit?: (data: FormValues) => void;
  onCancel?: () => void;
  initialData?: FormValues;
  isEditing?: boolean;
}

const CandidateForm = ({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {
    fullName: "",
    studentId: "",
    email: "",
    position: "",
    statement: "",
    phoneNumber: "",
  },
  isEditing = false,
}: CandidateFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingApplicationId, setEditingApplicationId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    fetchActiveElections();
    
    // Check if we're in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      setIsEditMode(true);
      setEditingApplicationId(editId);
      fetchApplicationForEdit(editId);
    }
  }, []);

  const fetchActiveElections = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/elections/active`);
      if (response.ok) {
        const data = await response.json();
        setElections(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
    }
  };

  const fetchApplicationForEdit = async (applicationId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/application/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const application = await response.json();
        // Populate form with existing data
        form.reset({
          fullName: application.name,
          studentId: application.StudentId,
          email: application.email,
          phoneNumber: application.phone,
          position: application.position,
          statement: application.statement,
        });
        setSelectedElection(application.electionId._id);
      }
    } catch (error) {
      console.error("Error fetching application:", error);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const url = isEditMode 
        ? `${import.meta.env.VITE_API_BASE_URL}/api/user/application/${editingApplicationId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/user/apply-candidate`;
      
      const method = isEditMode ? "PUT" : "POST";
      
      const requestBody = isEditMode 
        ? {
            name: data.fullName,
            phone: data.phoneNumber,
            statement: data.statement,
            position: data.position,
          }
        : {
            name: data.fullName,
            StudentId: data.studentId,
            email: data.email,
            phone: data.phoneNumber,
            statement: data.statement,
            position: data.position,
            electionId: selectedElection,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        onSubmit(data);
        setShowSuccessDialog(true);
        
        if (!isEditMode) {
          form.reset();
          setSelectedElection("");
        }
      } else {
        const errorData = await response.json();
        console.error("Submission failed:", errorData);
        // Handle specific error cases
        if (errorData.message.includes("already applied")) {
          alert("You have already applied for this election. You can only have one application per election.");
        } else {
          alert(errorData.message || "Failed to submit application");
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting your application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions = [
    { value: "president", label: "President" },
    { value: "vicePresident", label: "Vice President" },
    { value: "secretary", label: "Secretary" },
    { value: "treasurer", label: "Treasurer" },
    { value: "representative", label: "Class Representative" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {isEditing
                ? "Edit Candidate Application"
                : "Candidate Application Form"}
            </CardTitle>
            <CardDescription className="text-center">
              Fill out the form below to apply as a candidate for the upcoming
              election.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="S12345" 
                            {...field} 
                            disabled={isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Add Election Selection */}
                {!isEditMode && (
                  <div>
                    <FormField
                      control={form.control}
                      name="election"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Election</FormLabel>
                          <Select
                            value={selectedElection}
                            onValueChange={setSelectedElection}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose an election to apply for" />
                            </SelectTrigger>
                            <SelectContent>
                              {elections.map((election) => (
                                <SelectItem key={election._id} value={election._id}>
                                  {election.title} - {election.post}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the election you wish to apply for.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john.doe@example.com"
                            {...field}
                            disabled={isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {positions.map((position) => (
                            <SelectItem
                              key={position.value}
                              value={position.value}
                            >
                              {position.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the position you wish to run for in the election.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="statement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your candidate statement here..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Explain why you are running and what you hope to
                        accomplish if elected. (50-500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will discard all your changes. Any unsaved
                          data will be lost.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          No, continue editing
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={onCancel}>
                          Yes, discard changes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Submitting...</span>
                      </>
                    ) : isEditing ? (
                      "Save Changes"
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <AlertDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {isEditing
                  ? "Changes Saved Successfully"
                  : "Application Submitted"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isEditing
                  ? "Your candidate application has been updated successfully."
                  : "Your candidate application has been submitted successfully. The Election Commission will review your application and notify you of the status."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </div>
  );
};

export default CandidateForm;
