package com.example.spring.backend_utenti.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.spring.backend_utenti.dto.JwtResponse;
import com.example.spring.backend_utenti.dto.LoginRequest;
import com.example.spring.backend_utenti.dto.RegisterRequest;
import com.example.spring.backend_utenti.model.Ruolo;
import com.example.spring.backend_utenti.model.Utente;
import com.example.spring.backend_utenti.repository.UtenteRepository;
import com.example.spring.backend_utenti.security.JwtUtils;
import com.example.spring.backend_utenti.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UtenteRepository utenteRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${smartshift.app.codiceAdmin}")
    private String codiceAdmin;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils,
                          UtenteRepository utenteRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.utenteRepository = utenteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String ruolo = userDetails.getAuthorities().iterator().next().getAuthority();

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getNome(),
                userDetails.getCognome(),
                ruolo
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        if (registerRequest.getEmail() == null || registerRequest.getEmail().isBlank()
                || registerRequest.getPassword() == null || registerRequest.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Email e password sono obbligatorie.");
        }

        if (utenteRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Esiste gia' un account con questa email.");
        }

        Ruolo ruolo = Ruolo.RUOLO_DIPENDENTE;
        if (registerRequest.getCodiceAdmin() != null
                && registerRequest.getCodiceAdmin().equals(codiceAdmin)) {
            ruolo = Ruolo.RUOLO_ADMIN;
        }

        Utente utente = new Utente(
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                registerRequest.getNome(),
                registerRequest.getCognome(),
                ruolo
        );

        utenteRepository.save(utente);

        return ResponseEntity.ok("Registrazione completata con successo.");
    }
}
