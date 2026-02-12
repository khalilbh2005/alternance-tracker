package com.example.alternance_tracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiStatusController {

    @GetMapping("/status")
    public String status() {
        return "Alternance Tracker API is running";
    }
}