package com.example.spring.backend_utenti.service;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.spring.backend_utenti.dto.DipendentePagamentoDTO;
import com.example.spring.backend_utenti.model.Ruolo;
import com.example.spring.backend_utenti.model.Turno;
import com.example.spring.backend_utenti.model.Utente;
import com.example.spring.backend_utenti.repository.TurnoRepository;
import com.example.spring.backend_utenti.repository.UtenteRepository;

@Service
public class PagamentoService {

    @Autowired
    private UtenteRepository utenteRepository;

    @Autowired
    private TurnoRepository turnoRepository;

    @Transactional(readOnly = true)
    public List<DipendentePagamentoDTO> getDipendentiConOre() {
        return utenteRepository.findAll().stream()
                .filter(u -> u.getRuolo() == Ruolo.RUOLO_DIPENDENTE)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public DipendentePagamentoDTO aggiornaTariffa(Long utenteId, Double tariffaOraria) {
        if (tariffaOraria == null || tariffaOraria < 0) {
            throw new IllegalArgumentException("La tariffa oraria non può essere negativa.");
        }
        Utente utente = utenteRepository.findById(utenteId)
                .orElseThrow(() -> new RuntimeException("Dipendente non trovato"));
        utente.setTariffaOraria(tariffaOraria);
        utenteRepository.save(utente);
        return toDTO(utente);
    }

    private double calcolaOreTotali(Long utenteId) {
        List<Turno> turni = turnoRepository.findByUtenteId(utenteId);
        Duration totale = Duration.ZERO;
        for (Turno turno : turni) {
            if (turno.getInizioOrario() != null && turno.getFineOrario() != null
                    && turno.getFineOrario().isAfter(turno.getInizioOrario())) {
                totale = totale.plus(Duration.between(turno.getInizioOrario(), turno.getFineOrario()));
            }
        }
        double ore = totale.toMinutes() / 60.0;
        return Math.round(ore * 100.0) / 100.0;
    }

    private DipendentePagamentoDTO toDTO(Utente utente) {
        return new DipendentePagamentoDTO(
                utente.getId(),
                utente.getNome(),
                utente.getCognome(),
                utente.getEmail(),
                utente.getRuolo().name(),
                utente.getTariffaOraria(),
                calcolaOreTotali(utente.getId())
        );
    }
}
