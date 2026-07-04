package com.innovalab.ltitool.service;

import com.innovalab.ltitool.config.MoodleWsProperties;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class PdfService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final MoodleWsProperties props;

    public PdfService(MoodleWsProperties props) {
        this.props = props;
    }

    public byte[] downloadPdf(String fileUrl) {

        // agregar token SI es necesario ( TOKEN Es el que da el lms si habilitas apí con token)
        String finalUrl = fileUrl + (fileUrl.contains("?") ? "&" : "?")
                + "token=" + props.getToken();

        return restTemplate.getForObject(finalUrl, byte[].class);
    }
}
