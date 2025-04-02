// Functions for handling template download and data upload

// Download template function
export const downloadTemplate = (templateData) => {
  // Get the template structure from personalInfo.js
  const template = templateData ?? {
    headerInfo: {
      name: "Your Name",
      currentPosition: "Your Job Title",
      summary: "Your professional summary"
    },
    contactInfo: {
      email: {
        value: "mailto:your-email@example.com",
        displayValue: "your-email@example.com",
        icon: "fa fa-envelope"
      },
      phone: {
        value: "tel:your-phone-number",
        displayValue: "your-phone-number",
        icon: "fa fa-phone"
      },
      linkedin: {
        value: "https://www.linkedin.com/in/your-profile",
        displayValue: "linkedin.com/in/your-profile",
        icon: "fa fa-linkedin"
      }
    },
    workExperience: {
      "Company Name": {
        fromDate: "July 2022",
        place: "Location",
        toDate: "Present",
        jobTitle: "Your Job Title",
        workItems: [
          [
            "Work Item",
            [
              "Work Item Heading 1",
              "Work Item detail 1",
              "Work Item detail 2",
              "Work Item detail 3"
            ],
            [
              "Work Item Heading 2",
              "Work Item detail 1",
              "Work Item detail 2",
              "Work Item detail 3"
            ]
          ],
          [
            "Work Item Heading",
            "Work Item detail 1",
            "Work Item detail 2",
            "Work Item detail 3"
          ]
        ]
      },
      "Company Name 2": {
        fromDate: "Jan 2020",
        toDate: "June 2022",
        place: "Location",
        jobTitle: "Your Previous Job Title",
        workItems: [
          "Work Item Heading 1",
          "Work Item detail 1",
          "Work Item detail 2",
          "Work Item detail 3"
        ]
      }
    },
    education: {
      "Degree Name": {
        name: "Institution Name",
        from: "Start Date",
        to: "End Date",
        summary: []
      }
    },
    projects: [
      {
        title: "Project Name",
        detail: "Project Description"
      },
      {
        title: "Another Project",
        detail: "Another Project Description"
      }
    ],
    achievements: [],
    skills: [
      "Skill 1",
      "Skill 2",
      "Skill 3",
      "Skill 4",
      "Skill 5",
      "Skill 6"
    ]
  };

  // Convert to JSON string
  const jsonString = JSON.stringify(template, null, 2);
  
  // Create blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume-template.json';
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

// Handle file upload and return the parsed data
export const handleFileUpload = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}; 