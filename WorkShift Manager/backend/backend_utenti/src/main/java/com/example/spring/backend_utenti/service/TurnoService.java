package com.example.spring.backend_utenti.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.spring.backend_utenti.dto.TurnoDTO;
import com.example.spring.backend_utenti.model.Turno;
import com.example.spring.backend_utenti.model.Utente;
import com.example.spring.backend_utenti.repository.TurnoRepository;
import com.example.spring.backend_utenti.repository.UtenteRepository;

@Service
public class TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private UtenteRepository utenteRepository;

    public Turno creaTurno(TurnoDTO dto) {
        if (dto.getInizioOrario().isAfter(dto.getFineOrario())) {
            throw new IllegalArgumentException("L'orario di inizio non può essere successivo a quello di fine.");
        }

        // Verifica anti-sovrapposizione turni (RF-03)
        boolean sovrapposto = turnoRepository.existsTurnoSovrapposto(
                dto.getUtenteId(), dto.getInizioOrario(), dto.getFineOrario());

        if (sovrapposto) {
            throw new RuntimeException("Errore: Il dipendente ha già un turno assegnato in questa fascia oraria.");
        }

        Utente utente = utenteRepository.findById(dto.getUtenteId())
                .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        Turno turno = new Turno();
        turno.setUtente(utente);
        turno.setInizioOrario(dto.getInizioOrario());
        turno.setFineOrario(dto.getFineOrario());
        turno.setNote(dto.getNote());

        return turnoRepository.save(turno);
    }

    public List<Turno> getTurniPerUtente(Long utenteId) {
        return turnoRepository.findByUtenteId(utenteId);
    }

    public List<Turno> getAllTurni() {
        return turnoRepository.findAll();
    }
}