package com.example.spring.backend_utenti.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.spring.backend_utenti.model.Utente;

public interface UtenteRepository  extends JpaRepository<Utente, Long> {
    Optional<Utente> findByEmail(String email);
    Boolean existsByEmail(String email);
}
