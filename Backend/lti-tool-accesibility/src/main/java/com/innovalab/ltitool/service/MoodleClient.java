package com.innovalab.ltitool.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.innovalab.ltitool.config.MoodleWsProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MoodleClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final MoodleWsProperties props;

    public MoodleClient(MoodleWsProperties props) {
        this.props = props;
    }

    public JsonNode getCourseContents(Long courseId) {
        String url = props.getBaseUrl()
                + "?wstoken=" + props.getToken()
                + "&wsfunction=core_course_get_contents"
                + "&moodlewsrestformat=json"
                + "&courseid=" + courseId;

        return restTemplate.getForObject(url, JsonNode.class);
    }
}