package com.example.spring.backend_utenti.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.spring.backend_utenti.dto.TurnoDTO;
import com.example.spring.backend_utenti.model.Turno;
import com.example.spring.backend_utenti.service.TurnoService;

@RestController
@RequestMapping("/api/turni")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> creaTurno(@RequestBody TurnoDTO turnoDTO) {
        try {
            Turno nuovoTurno = turnoService.creaTurno(turnoDTO);
            return ResponseEntity.ok(nuovoTurno);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Turno>> getAllTurni() {
        return ResponseEntity.ok(turnoService.getAllTurni());
    }

    @GetMapping("/utente/{utenteId}")
    public ResponseEntity<List<Turno>> getTurniPerUtente(@PathVariable Long utenteId) {
        return ResponseEntity.ok(turnoService.getTurniPerUtente(utenteId));
    }
}
