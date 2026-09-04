package com.example.spring.backend_utenti.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.spring.backend_utenti.dto.DipendentePagamentoDTO;
import com.example.spring.backend_utenti.service.PagamentoService;

@RestController
@RequestMapping("/api/pagamenti")
public class PagamentoController {

    @Autowired
    private PagamentoService pagamentoService;

    @GetMapping("/dipendenti")
    @PreAuthorize("hasAuthority('RUOLO_ADMIN')")
    public ResponseEntity<?> getDipendenti() {
        try {
            return ResponseEntity.ok(pagamentoService.getDipendentiConOre());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/dipendenti/{utenteId}/tariffa")
    @PreAuthorize("hasAuthority('RUOLO_ADMIN')")
    public ResponseEntity<?> aggiornaTariffa(@PathVariable Long utenteId,
                                             @RequestBody TariffaRequest request) {
        try {
            return ResponseEntity.ok(pagamentoService.aggiornaTariffa(utenteId, request.getTariffaOraria()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class TariffaRequest {
        private Double tariffaOraria;

        public Double getTariffaOraria() { return tariffaOraria; }
        public void setTariffaOraria(Double tariffaOraria) { this.tariffaOraria = tariffaOraria; }
    }
}
