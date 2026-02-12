package com.example.alternance_tracker.controller;

import com.example.alternance_tracker.entity.Contact;
import com.example.alternance_tracker.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    // GET /api/contacts  ou  GET /api/contacts?companyId=2
    @GetMapping
    public List<Contact> getAll(@RequestParam(required = false) Long companyId) {
        return contactService.findAll(companyId);
    }

    @GetMapping("/{id}")
    public Contact getById(@PathVariable Long id) {
        return contactService.findById(id);
    }

    // POST /api/contacts?companyId=2
    @PostMapping
    public Contact create(@RequestParam Long companyId, @Valid @RequestBody Contact contact) {
        return contactService.create(companyId, contact);
    }

    @PutMapping("/{id}")
    public Contact update(@PathVariable Long id, @Valid @RequestBody Contact contact) {
        return contactService.update(id, contact);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        contactService.delete(id);
    }
}
