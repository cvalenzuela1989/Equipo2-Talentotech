package com.innovalab.ltitool.dto;

import java.time.Instant;

public class LtiLaunchDTO {  // ================= USER =================
    private String userId;
    private String name;
    private String email;

    // ================= COURSE =================
    private String courseId;
    private String courseTitle;

    // ================= SECTION =================
    private String sectionId;
    private String sectionTitle;

    // ================= MODULE =================
    private String moduleId;
    private String moduleTitle;

    // ================= FRONT =================
    private String status;
    private String message;

    private String pdfName;
    private String pdfUrl;

    private String resourceLinkId;

    //Identificador unico de la peticion del LMS
    private String idLaunch;

    private Instant launchTime;

    public String getResourceLinkId() {
        return resourceLinkId;
    }

    public void setResourceLinkId(String resourceLinkId) {
        this.resourceLinkId = resourceLinkId;
    }

    // getters/setters

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getModuleId() {
        return moduleId;
    }

    public void setModuleId(String moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleTitle() {
        return moduleTitle;
    }

    public void setModuleTitle(String moduleTitle) {
        this.moduleTitle = moduleTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getSectionTitle() {
        return sectionTitle;
    }

    public void setSectionTitle(String sectionTitle) {
        this.sectionTitle = sectionTitle;
    }

    public String getPdfName() {
        return pdfName;
    }

    public void setPdfName(String pdfName) {
        this.pdfName = pdfName;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

   public void setIdLaunch(String idLaunch) {
        this.idLaunch = idLaunch;
    }

    public String getIdLaunch() {
        return idLaunch;
    }

    public Instant getLaunchTime() { return launchTime;   }

    public void setLaunchTime(Instant launchTime) { this.launchTime = launchTime;   }

    @Override
    public String toString() {
        return "LtiLaunchDTO{" +
                "userId='" + userId + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", courseId='" + courseId + '\'' +
                ", courseTitle='" + courseTitle + '\'' +
                ", sectionId='" + sectionId + '\'' +
                ", sectionTitle='" + sectionTitle + '\'' +
                ", moduleId='" + moduleId + '\'' +
                ", moduleTitle='" + moduleTitle + '\'' +
                ", status='" + status + '\'' +
                ", message='" + message + '\'' +
                ", pdfName='" + pdfName + '\'' +
                ", pdfUrl='" + pdfUrl + '\'' +
                ", resourceLinkId='" + resourceLinkId + '\'' +
                ", idLaunch='" + idLaunch + '\'' +
                ", launchTime=" + launchTime +
                '}';
    }
}