package com.example.alternance_tracker.controller;

import com.example.alternance_tracker.entity.Offer;
import com.example.alternance_tracker.service.OfferService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    // Exemple: /api/offers?companyId=1
    @GetMapping
    public List<Offer> getAll(@RequestParam(required = false) Long companyId) {
        return offerService.findAll(companyId);
    }

    @GetMapping("/{id}")
    public Offer getById(@PathVariable Long id) {
        return offerService.findById(id);
    }

    // Créer une offre pour une entreprise :
    // POST /api/offers?companyId=1
    @PostMapping
    public Offer create(
            @RequestParam Long companyId,
            @Valid @RequestBody Offer offer
    ) {
        return offerService.create(companyId, offer);
    }

    @PutMapping("/{id}")
    public Offer update(@PathVariable Long id, @Valid @RequestBody Offer offer) {
        return offerService.update(id, offer);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        offerService.delete(id);
    }
}
