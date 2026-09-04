package com.example.spring.backend_utenti.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.spring.backend_utenti.dto.TurnoDTO;
import com.example.spring.backend_utenti.dto.TurnoResponseDTO;
import com.example.spring.backend_utenti.security.UserDetailsImpl;
import com.example.spring.backend_utenti.service.TurnoService;

@RestController
@RequestMapping("/api/turni")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    @PostMapping
    @PreAuthorize("hasAuthority('RUOLO_ADMIN')")
    public ResponseEntity<?> creaTurno(@RequestBody TurnoDTO turnoDTO) {
        try {
            TurnoResponseDTO nuovoTurno = turnoService.creaTurno(turnoDTO);
            return ResponseEntity.ok(nuovoTurno);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/miei")
    public ResponseEntity<?> creaMioTurno(@RequestBody TurnoDTO turnoDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            TurnoResponseDTO nuovoTurno = turnoService.creaTurnoPerUtente(userDetails.getId(), turnoDTO);
            return ResponseEntity.ok(nuovoTurno);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/miei/{turnoId}")
    public ResponseEntity<?> eliminaMioTurno(@PathVariable Long turnoId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            turnoService.eliminaTurnoPerUtente(userDetails.getId(), turnoId);
            return ResponseEntity.ok("Turno eliminato con successo.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TurnoResponseDTO>> getAllTurni() {
        return ResponseEntity.ok(turnoService.getAllTurniDTO());
    }

    @GetMapping("/utente/{utenteId}")
    public ResponseEntity<List<TurnoResponseDTO>> getTurniPerUtente(@PathVariable Long utenteId) {
        return ResponseEntity.ok(turnoService.getTurniPerUtenteDTO(utenteId));
    }

    @PostMapping("/timbratura/inizio")
    public ResponseEntity<?> timbraInizio() {
        try {
            UserDetailsImpl userDetails = currentUser();
            return ResponseEntity.ok(turnoService.timbraInizio(userDetails.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/timbratura/fine")
    public ResponseEntity<?> timbraFine() {
        try {
            UserDetailsImpl userDetails = currentUser();
            return ResponseEntity.ok(turnoService.timbraFine(userDetails.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/timbratura/stato")
    public ResponseEntity<?> statoTimbratura() {
        try {
            UserDetailsImpl userDetails = currentUser();
            return ResponseEntity.ok(turnoService.getTimbraturaAttivaDTO(userDetails.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private UserDetailsImpl currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
}
