import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  initializeRehoming,
  updatePetInfo,
  finalizeRehoming,
  uploadPetImages,
} from "../../services/rehoming.service";
import "./ChooseToRehome.css";
import axios from "axios";

export const paymentLink = async () => {
  try {
    const response = await axios.post(`http://localhost:8080/api/payment`);
    return response.data.data.paymentLinkUrl;
  } catch (err) {
    console.log(err);
  }
};

const ChooseToRehome = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [error, setError] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

  const [paymentLinkUrl, setPaymentLinkUrl] = useState("");

  const petId = localStorage.getItem("petId");
  const [petData, setPetData] = useState({
    type: "",
    name: "",
    age: "",
    gender: "",
    breed: "",
    color: "",
    size: "",
    spayed: "",
    rehomingReason: "",
    timeAvailable: "",
    location: {
      postcode: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
    },
    personality: "",
    dailyRoutine: "",
    idealHome: "",
    images: [],
    documents: [],
    keyFacts: {
      microchipped: "",
      houseTrained: "",
      vaccinated: "",
    },
  });

  useEffect(() => {
    const fetchPaymentLink = async () => {
      const response = await paymentLink();
      setPaymentLinkUrl(response);
    };
    fetchPaymentLink();
  }, []);

  const handleInputChange = (field, value, category = null) => {
    setPetData((prev) => {
      if (category) {
        return {
          ...prev,
          [category]: {
            ...prev[category],
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleFileChange = (event, type) => {
    const files = Array.from(event.target.files);
    setPetData((prev) => ({
      ...prev,
      [type]: [...prev[type] || [], ...files],
    }));
  };

  const handleNext = async () => {
    if (currentStep === 1 && !termsAgreed) {
      setError("Please agree to the terms and conditions");
      return;
    }

    try {
      if (currentStep === 1) {
        await initializeRehoming(termsAgreed);
        setError("");
      } else if (currentStep > 1 && currentStep < 8) {
        console.log("petData", petData.images);
        if (currentStep === 3 && petData.images && petData.images.length > 0) {
          const formData = new FormData();
          petData.images.forEach((file, index) => {
            formData.append("images", file);
          });
          formData.append("petId", petId);

          const uploadResponse = await uploadPetImages(formData);
          console.log("Uploaded images:", uploadResponse);

          const updatedPetData = {
            ...petData,
            images: uploadResponse.images,
            step: currentStep,
            petId,
          };

          await updatePetInfo(updatedPetData);
        } else {
          await updatePetInfo({
            ...petData,
            step: currentStep,
            petId,
          });
        }
      }

      if (currentStep === 8) {
        await finalizeRehoming(petData);
        localStorage.removeItem("rehomerId");
        localStorage.removeItem("petId");
        window.location.href = paymentLinkUrl;
        return;
      }

      if (currentStep < 9) {
        setCurrentStep(currentStep + 1);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content welcome-section">
            <div className="welcome-header">
              <h2>Welcome to Rehome Your Pet</h2>
              <p className="welcome-description">
                To apply for rehoming your pet, please fill out the required
                details. Click "Start" to begin the process.
              </p>
            </div>
            <div className="user-details-card">
              <h3>Your Information</h3>
              <div className="user-info-grid">
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{userInfo.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{userInfo.name}</span>
                </div>
                {userInfo.phone && (
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{userInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="error-container">
                <p className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </p>
              </div>
            )}

            <div className="terms-section">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  required
                />
                <span className="checkbox-text">
                  I agree to the <a href="#terms">Terms</a> and{" "}
                  <a href="#privacy-policy">Privacy Policy</a>
                </span>
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content primary-questions-section">
            <div className="section-header">
              <h2>Primary Questions</h2>
              <p className="section-description">Please tell us about your pet and your situation</p>
            </div>
            
            <form className="primary-questions">
              <div className="question-group">
                <label className="question-label">
                  Are you rehoming a dog or cat?
                </label>
                <div className="radio-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="type"
                      value="dog"
                      checked={petData.type === "dog"}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      required
                    />
                    <span className="radio-label">Dog</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="type"
                      value="cat"
                      checked={petData.type === "cat"}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      required
                    />
                    <span className="radio-label">Cat</span>
                  </label>
                </div>
              </div>

              <div className="question-group">
                <label className="question-label">
                  Is your pet neutered?
                </label>
                <div className="radio-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="spayed"
                      value="yes"
                      checked={petData.spayed === "yes"}
                      onChange={(e) => handleInputChange("spayed", e.target.value)}
                      required
                    />
                    <span className="radio-label">Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="spayed"
                      value="no"
                      checked={petData.spayed === "no"}
                      onChange={(e) => handleInputChange("spayed", e.target.value)}
                      required
                    />
                    <span className="radio-label">No</span>
                  </label>
                </div>
              </div>

              <div className="question-group">
                <label className="question-label">
                  Why do you need to rehome your pet?
                </label>
                <select
                  className="select-input"
                  value={petData.rehomingReason}
                  onChange={(e) => handleInputChange("rehomingReason", e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="moving">Moving</option>
                  <option value="allergies">Allergies</option>
                  <option value="financial">Financial difficulties</option>
                </select>
              </div>

              <div className="question-group">
                <label className="question-label">
                  How long can you keep your pet while we find a home?
                </label>
                <select
                  className="select-input"
                  value={petData.timeAvailable}
                  onChange={(e) => handleInputChange("timeAvailable", e.target.value)}
                  required
                >
                  <option value="">Please select</option>
                  <option value="1week">1 week</option>
                  <option value="1month">1 month</option>
                  <option value="more">More than a month</option>
                </select>
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>Pet's Images</h2>
            <p>
              Upload images of your pet. Accepted formats are (.jpg, .png,
              .jpeg). Dimensions should be 600x600 pixels. Max size is 1024 KB.
            </p>
            <div className="image-grid">
              {[1, 2, 3, 4].map((num) => (
                <div className="image-box" key={num}>
                  <span>{num}. Main</span>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "images")}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2>Characteristics</h2>
            <form className="characteristics-form">
              <label>
                Pet's Name *
                <input
                  type="text"
                  value={petData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter pet's name"
                  required
                />
              </label>
              <label>
                Age (Years) *
                <input
                  type="number"
                  value={petData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  min="0"
                  placeholder="0"
                  required
                />
              </label>
              <label>
                Size *
                <select
                  value={petData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </label>
              <label>
                Gender *
                <select
                  value={petData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="">Please select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              <label>
                Breed(s) *
                <input
                  type="text"
                  value={petData.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  placeholder="Enter breed(s)"
                  required
                />
              </label>
              <label>
                Colors
                <input
                  type="text"
                  value={petData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Enter colors"
                  required
                />
              </label>
            </form>
          </div>
        );
      case 5:
        return (
          <div className="step-content primary-questions-section">
            <div className="section-header">
              <h2>Key Facts</h2>
              <p className="section-description">Help us understand your pet better</p>
            </div>
            
            <form className="primary-questions">
              <div className="question-group">
                <label className="question-label">
                  Is your pet microchipped?
                </label>
                <div className="radio-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="microchipped"
                      value="yes"
                      checked={petData.keyFacts?.microchipped === "yes"}
                      onChange={(e) => handleInputChange("microchipped", e.target.value, "keyFacts")}
                      required
                    />
                    <span className="radio-label">Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="microchipped"
                      value="no"
                      checked={petData.keyFacts?.microchipped === "no"}
                      onChange={(e) => handleInputChange("microchipped", e.target.value, "keyFacts")}
                      required
                    />
                    <span className="radio-label">No</span>
                  </label>
                </div>
              </div>
              <div className="question-group">
                <label className="question-label">
                  Is your pet house-trained?
                </label>
                <div className="radio-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="houseTrained"
                      value="yes"
                      checked={petData.keyFacts?.houseTrained === "yes"}
                      onChange={(e) => handleInputChange("houseTrained", e.target.value, "keyFacts")}
                      required
                    />
                    <span className="radio-label">Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="houseTrained"
                      value="no"
                      checked={petData.keyFacts?.houseTrained === "no"}
                      onChange={(e) => handleInputChange("houseTrained", e.target.value, "keyFacts")}
                      required
                    />
                    <span className="radio-label">No</span>
                  </label>
                </div>
              </div>

              <div className="question-group">
                <label className="question-label">
                  Has your pet received regular vaccinations?
                </label>
                <div className="radio-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="vaccinated"
                      value="yes"
                      checked={petData.keyFacts?.vaccinated === "yes"}
                      onChange={(e) => handleInputChange("vaccinated", e.target.value, "keyFacts")}
                      required
                    />
                    <span className="radio-label">Yes</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="vaccinated"
                      value="no"
                      checked={petData.keyFacts?.vaccinated === "no"}
                      onChange={(e) => handleInputChange("vaccinated", e.target.value, "keyFacts")}
                      required
                    />
                    <span className="radio-label">No</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        );
      case 6:
        return (
          <div className="step-content">
            <h2>Pet's Location</h2>
            <form className="location-form">
              <label>
                Postcode *
                <input
                  type="text"
                  value={petData.location.postcode}
                  onChange={(e) =>
                    handleInputChange("postcode", e.target.value, "location")
                  }
                  placeholder="Enter postcode"
                  required
                />
              </label>
              <label>
                Address Line 1 *
                <input
                  type="text"
                  value={petData.location.addressLine1}
                  onChange={(e) =>
                    handleInputChange(
                      "addressLine1",
                      e.target.value,
                      "location"
                    )
                  }
                  placeholder="Enter address line 1"
                  required
                />
              </label>
              <label>
                Address Line 2
                <input
                  type="text"
                  value={petData.location.addressLine2}
                  onChange={(e) =>
                    handleInputChange(
                      "addressLine2",
                      e.target.value,
                      "location"
                    )
                  }
                  placeholder="Enter address line 2"
                  required
                />
              </label>
              <label>
                City *
                <input
                  type="text"
                  value={petData.location.city}
                  onChange={(e) =>
                    handleInputChange("city", e.target.value, "location")
                  }
                  placeholder="Enter city"
                  required
                />
              </label>
            </form>
          </div>
        );
      case 7:
        return (
          <div className="step-content">
            <h2>Tell Your Pet's Story</h2>
            <p className="description">
              Help potential adopters connect with your pet by sharing their
              story.
            </p>

            <div className="story-form">
              <label htmlFor="petPersonality">
                What's your pet's personality like?
              </label>
              <textarea
                id="petPersonality"
                value={petData.personality}
                onChange={(e) =>
                  handleInputChange("personality", e.target.value)
                }
                placeholder="Describe your pet's temperament, favorite activities, and unique traits..."
                required
              ></textarea>

              <label htmlFor="dailyRoutine">What's their daily routine?</label>
              <textarea
                id="dailyRoutine"
                value={petData.dailyRoutine}
                onChange={(e) =>
                  handleInputChange("dailyRoutine", e.target.value)
                }
                placeholder="Share about their eating habits, exercise needs, sleeping schedule..."
                required
              ></textarea>

              <label htmlFor="idealHome">
                What would be their ideal new home?
              </label>
              <textarea
                id="idealHome"
                value={petData.idealHome}
                onChange={(e) => handleInputChange("idealHome", e.target.value)}
                placeholder="Describe the perfect environment and family for your pet..."
                required
              ></textarea>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="step-content">
            <h2>Upload Documents</h2>
            <p className="description">
              Upload any relevant documents for your pet (vaccination records,
              medical history, etc.). Accepted formats are (.pdf, .jpg, .png).
              Max size is 5MB per file.
            </p>
            <div className="document-grid">
              {[1, 2, 3, 4].map((num) => (
                <div className="document-box" key={num}>
                  <span>{num}. Document</span>
                  <div className="upload-area">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "documents")}
                      required
                    />
                    <p>Click to upload or drag and drop</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 9:
        return (
          <div className="step-content">
            <h2>Confirmation</h2>
            <div className="confirmation-content">
              <div className="confirmation-icon">✓</div>
              <h3>Thank You for Choosing to Rehome Your Pet with Us!</h3>
              <p>We have received all your information successfully.</p>

              <div className="next-steps">
                <h4>What happens next?</h4>
                <ul>
                  <li>We will review your submission within 24-48 hours</li>
                  <li>
                    You'll receive an email confirmation with your listing
                    details
                  </li>
                  <li>
                    When potential adopters show interest, we'll notify you
                    immediately
                  </li>
                  <li>
                    You can track the status of your listing in your dashboard
                  </li>
                </ul>
              </div>

              <div className="contact-info">
                <p>If you have any questions, please contact us at:</p>
                <p>Email: support@paws4home.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Content for Step {currentStep} is not available yet.</p>;
    }
  };

  return (
    <div className="choose-to-rehome flex flex-col items-center">
      <div className="progress-bar">
        <img
          src={require(`../../../public/assets/stepsRehome/step${currentStep}.png`)}
          alt={`Step ${currentStep}`}
          className="progress-image"
        />
      </div>

      <div className="form-content">
        <h1>Step {currentStep} of 9</h1>
        <p>
          Fill in the details for your pet. These will help adopters learn more
          about them.
        </p>
        <div className="form-fields">{renderStepContent()}</div>
      </div>

      <div className="navigation-buttons ">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="back-button"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === 9}
          className="next-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ChooseToRehome;
